package service

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
	"log"

	"meal-seek/backend/config"
	"meal-seek/backend/model"
)

const (
	hotPepperAPIBaseURL = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/"
)

type HotPepperService struct {
	APIKey string
	Client *http.Client
}

//HotPepperServiceの新しいインスタンスの作成
func NewHotPepperService() *HotPepperService {
	return &HotPepperService{
		APIKey: config.Cfg.HotPepperApiKey, 
		Client: &http.Client{Timeout: 10 * time.Second}, 
	}
}

// 指定された条件でレストランを検索
func (s *HotPepperService) SearchRestaurants(params model.SearchRequest) (*model.HotPepperGourmetResponse, error) {
	if s.APIKey == "" {
		return nil, fmt.Errorf("APIキーが設定されていません")
	}

	//URL文字列をパースする
	reqURL, err := url.Parse(hotPepperAPIBaseURL)
	if err != nil {
		log.Printf("error: URLのパースに失敗しました: %v", err)
		return nil, fmt.Errorf("error: URLのパースに失敗しました")
	}

	// クエリのパラメータを設定
	query := reqURL.Query()
	query.Set("key", s.APIKey)
	query.Set("format", "json") 

	// クライアント側からの検索条件をクエリのパラメータに変換
	if params.Keyword != nil && *params.Keyword != "" { query.Set("keyword", *params.Keyword) }
	if len(params.GenreCodes) > 0 { query.Set("genre", strings.Join(params.GenreCodes, ",")) }
	if params.RadiusCode != nil && *params.RadiusCode != "" { query.Set("range", *params.RadiusCode) }
	if params.Lat != nil { query.Set("lat", strconv.FormatFloat(*params.Lat, 'f', -1, 64)) }
	if params.Lng != nil { query.Set("lng", strconv.FormatFloat(*params.Lng, 'f', -1, 64)) }
	
	// ページネーションの設定
	start := 1
	if params.Start > 0 { start = params.Start }
	query.Set("start", strconv.Itoa(start))

	// 取得件数の設定
	count := 10
	if params.Count > 0 { count = params.Count }
	query.Set("count", strconv.Itoa(count))

	// クエリパラメータをURLに追加
	reqURL.RawQuery = query.Encode()

	// APIリクエストを送信
	resp, err := s.Client.Get(reqURL.String())
	if err != nil {
		return nil, fmt.Errorf("error: リクエストが失敗しました: %w", err)
	}
	defer resp.Body.Close()

	// レスポンスボディを読み込み
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error: レスポンスの読み込みに失敗しました: %w", err)
	}

	// ステータスコードの確認　（200じゃなかったらエラーを返す）
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error: (ステータス: %d, 内容: %s)", resp.StatusCode, string(body))
	}

	// 受け取ったJSONデータをGoの構造体に変換
	var gourmetResponse model.HotPepperGourmetResponse
	if err := json.Unmarshal(body, &gourmetResponse); err != nil {
		return nil, fmt.Errorf("error: レスポンス形式が正しくありません: %w (受信データ: %s)", err, string(body))
	}

	// エラー情報を返してきた場合
	if gourmetResponse.Results.Error != nil && len(gourmetResponse.Results.Error) > 0 {
		errMsg := gourmetResponse.Results.Error[0].Message
		return nil, fmt.Errorf("error: %s (コード: %d)", errMsg, gourmetResponse.Results.Error[0].Code)
	}

	return &gourmetResponse, nil
}

// 店舗IDでレストランの詳細情報を取得
func (s *HotPepperService) GetShopDetails(shopID string) (*model.Shop, error) {
	if s.APIKey == "" {
		return nil, fmt.Errorf("APIキーが設定されていません")
	}
	if shopID == "" {
		return nil, fmt.Errorf("店舗IDは必須です")
	}

	reqURL, err := url.Parse(hotPepperAPIBaseURL)
	if err != nil {
		log.Printf("error: URLのパースに失敗しました: %v", err)
		return nil, fmt.Errorf("error: URLのパースに失敗しました")
	}
	
	query := reqURL.Query()
	query.Set("key", s.APIKey)
	query.Set("format", "json")
	query.Set("id", shopID)   
	query.Set("count", "1") 

	reqURL.RawQuery = query.Encode()

	resp, err := s.Client.Get(reqURL.String())
	if err != nil {
		return nil, fmt.Errorf("error: リクエストが失敗しました: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error:レスポンスの読み込みに失敗しました: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error: (ステータス: %d, 内容: %s)", resp.StatusCode, string(body))
	}
	
	var gourmetResponse model.HotPepperGourmetResponse
	if err := json.Unmarshal(body, &gourmetResponse); err != nil {
		return nil, fmt.Errorf("error:レスポンス形式が正しくありません: %w (レスポンスデータ: %s)", err, string(body))
	}

	if gourmetResponse.Results.Error != nil && len(gourmetResponse.Results.Error) > 0 {
		errMsg := gourmetResponse.Results.Error[0].Message
		return nil, fmt.Errorf("error: %s (StatusCode: %d)", errMsg, gourmetResponse.Results.Error[0].Code)
	}
	
	// 店舗情報が取得できたか確認
	if len(gourmetResponse.Results.Shops) > 0 {
		// 返ってきた店舗IDがリクエストしたものと一致するか確認
		if gourmetResponse.Results.Shops[0].ID == shopID {
			return &gourmetResponse.Results.Shops[0], nil
		}
		return nil, fmt.Errorf("要求した店舗ID %s とAPIが返した店舗ID %s が一致しません", shopID, gourmetResponse.Results.Shops[0].ID)
	}

	// 店舗が見つからなかった場合
	log.Printf("情報: 店舗ID %s の店舗は見つかりませんでした", shopID)
	return nil, fmt.Errorf("店舗ID: %s の店舗は見つかりませんでした", shopID)
}