package model

// クライアント側からの店舗検索リクエストの構造
type SearchRequest struct {
	Keyword      *string  `json:"keyword,omitempty"`       // 検索キーワード
	GenreCodes   []string `json:"genreCodes,omitempty"`    // ジャンルコード (ホットペッパーAPI: genre)
	RadiusCode   *string  `json:"radiusCode,omitempty"`    // 検索範囲コード (ホットペッパーAPI: range)
	Lat          *float64 `json:"lat,omitempty"`           // 緯度
	Lng          *float64 `json:"lng,omitempty"`           // 経度
	Start        int      `json:"start,omitempty"`         // ページネーション: 結果の開始位置
	Count        int      `json:"count,omitempty"`         // ページネーション: 取得件数
}

// ホットペッパーグルメサーチAPIのレスポンス全体の構造
type HotPepperGourmetResponse struct {
	Results struct {
		APIVersion        string           `json:"api_version"`        // APIバージョン
		ResultsAvailable  int              `json:"results_available"`  // 総検索結果件数
		ResultsReturned   string           `json:"results_returned"`   // 今回返された件数 (文字列注意)
		ResultsStart      int              `json:"results_start"`      // 今回の結果の開始位置
		Shops             []Shop           `json:"shop"`               // 店舗情報の配列
		Error             []HotPepperError `json:"error,omitempty"`    // APIエラー情報
	} `json:"results"`
}

// ホットペッパーグルメサーチAPIが返す店舗情報の構造
type Shop struct {
	ID      string `json:"id"`              // 店舗ID
	Name    string `json:"name"`            // 店舗名
	Address string `json:"address"`         // 住所
	Access  string `json:"mobile_access"`   // 交通アクセス (モバイル表示用)
	Photo   struct {                        // 写真URL
		PC struct {							// PC用 写真
			L string `json:"l"`
			M string `json:"m"` 
			S string `json:"s"` 
		} `json:"pc"`
		Mobile struct {						// モバイル用 写真
			L string `json:"l"` 
			S string `json:"s"`
		} `json:"mobile"`
	} `json:"photo"`
	Genre struct {
		Name  string `json:"name"`  		// ジャンル名
		Code  string `json:"code"` 			// ジャンルコード
		Catch string `json:"catch"` 		// ジャンルキャッチコピー
	} `json:"genre"`
	Budget struct {                         // 予算情報
		Average string `json:"average"` 	// 平均予算
		Name    string `json:"name"`    	// 予算帯の名称
		Code    string `json:"code"`    	// 予算コード
	} `json:"budget"`
	Open      string  `json:"open"`       	// 営業時間
	Close     string  `json:"close"`      	// 定休日
	Lat       float64 `json:"lat"`        	// 緯度
	Lng       float64 `json:"lng"`        	// 経度
	CouponURLs struct {                      
		PC string `json:"pc"` 				// クーポンページURL(PC)
		SP string `json:"sp"`				// クーポンページURL(モバイル)
	} `json:"coupon_urls"`
	URLs struct {                          // 店舗URL
		PC string `json:"pc"`
	} `json:"urls"`
	Card 	string `json:"card"`          // カード利用可否
	Wifi	string `json:"wifi"`          // Wi-Fi利用可否
	NonSmoking string `json:"non_smoking"` // 禁煙席の有無
	PrivateRoom string `json:"private_room"` // 個室の有無
	Free_food	string `json:"free_food"`    // 食べ放題の有無
	FreeDrink	string `json:"free_drink"`	// 飲み放題の有無
	Parking		string `json:"parking"`      // 駐車場の有無
}

// ホットペッパーグルメサーチAPIが返すエラー情報の構造
type HotPepperError struct {
	Code    int    `json:"code"`    // エラーコード
	Message string `json:"message"` // エラーメッセージ
}

// サーバーからクライアント側に返す検索結果の構造
type SearchResponse struct {
	Shops            []Shop `json:"shops"`               // 店舗情報の配列
	ResultsAvailable int    `json:"results_available"`   // 総検索結果件数
	ResultsReturned  int    `json:"results_returned"`    // 今回返された件数
	ResultsStart     int    `json:"results_start"`       // 今回の結果の開始位置
}