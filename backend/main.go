package main

import (
	"log"
	"net/http"
	"meal-seek/backend/api"
	"meal-seek/backend/config"
	"meal-seek/backend/service"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	//設定のロード
	config.LoadConfig()

	//サービスの初期化
	hpService := service.NewHotPepperService()

	//ハンドラの初期化
	searchHandler := api.NewSearchHandler(hpService)

	//Ginルーターの初期化
	router := gin.Default()

	//CORSの設定
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{config.Cfg.FrontendURL}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	corsConfig.AllowCredentials = true
	router.Use(cors.New(corsConfig))

	//ルートの定義
	apiGroup := router.Group("/api")
	{
		hpGroup := apiGroup.Group("/hp")
		{
			hpGroup.POST("/search", searchHandler.SearchRestaurants)
			hpGroup.GET("/shops/:id", searchHandler.GetShopDetails)
		}
	}

	//テスト用のルート
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "HelloWorld!",
		})
	})

	//サーバーの起動ポート設定
	serverPort := config.Cfg.GoServerPort 
	addr := ":" + serverPort

	//サーバーの起動
	if err := router.Run(addr); err != nil {
		log.Fatalf("error: サーバーの起動に失敗しました: %v", err)
	}
}