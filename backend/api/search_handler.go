package api

import (
	"log"
	"net/http"
	"strconv"
	"strings"

	"meal-seek/backend/model"
	"meal-seek/backend/service"

	"github.com/gin-gonic/gin"
)
type SearchHandler struct {
	hpService *service.HotPepperService
}

// SearchHandlerのインスタンスを作成
func NewSearchHandler(hpService *service.HotPepperService) *SearchHandler {
	return &SearchHandler{
		hpService: hpService,
	}
}

// /api/hp/search へのPOSTリクエストを処理し、店舗検索結果を返す。
func (h *SearchHandler) SearchRestaurants(c *gin.Context) {
	var req model.SearchRequest

	// リクエストボディのJSONをバインド
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("error: SearchRestaurants - リクエストボディのJSONバインド失敗: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "無効なリクエスト形式です: " + err.Error()})
		return
	}

	// ページネーションのデフォルト値
	if req.Start == 0 { req.Start = 1 }
	if req.Count == 0 { req.Count = 10 }

	// レストラン情報取得関数にリクエスト情報を渡す
	hpResponse, err := h.hpService.SearchRestaurants(req)
	if err != nil {
		log.Printf("error: SearchRestaurants - HotPepperServiceからのエラー: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "店舗の検索に失敗しました: " + err.Error()})
		return
	}

	// results_returned を数値に変換
	resultsReturnedInt, convErr := strconv.Atoi(hpResponse.Results.ResultsReturned)
	if convErr != nil {
		log.Printf("警告: SearchRestaurants - results_returned の数値変換に失敗: %v。値: '%s'", convErr, hpResponse.Results.ResultsReturned)
		if len(hpResponse.Results.Shops) > 0 {
			resultsReturnedInt = len(hpResponse.Results.Shops)
		} else {
			resultsReturnedInt = 0 
		}
	}

	// レスポンスの構築
	response := model.SearchResponse{
		Shops:            hpResponse.Results.Shops,
		ResultsAvailable: hpResponse.Results.ResultsAvailable,
		ResultsReturned:  resultsReturnedInt,
		ResultsStart:     hpResponse.Results.ResultsStart,
	}
	c.JSON(http.StatusOK, response)
}

// /api/hp/shops/:id へのGETリクエストを処理し、店舗詳細を返す
func (h *SearchHandler) GetShopDetails(c *gin.Context) {
	shopID := c.Param("id")
	if shopID == "" {
		log.Println("error: GetShopDetails - 店舗IDが指定されていません。")
		c.JSON(http.StatusBadRequest, gin.H{"error": "店舗IDは必須です"})
		return
	}

	// レストランの詳細情報を取得する関数に店舗IDを渡す
	shopDetails, err := h.hpService.GetShopDetails(shopID)
	if err != nil {
		log.Printf("エラー: GetShopDetails - HotPepperServiceからのエラー (ID: %s): %v", shopID, err)
		errStr := strings.ToLower(err.Error())
		if strings.Contains(errStr, "not found") || strings.Contains(errStr, "mismatch") {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else if strings.Contains(errStr, "api key") {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "サーバーエラーが発生しました"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "店舗詳細の取得に失敗しました: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"shop": shopDetails})
}