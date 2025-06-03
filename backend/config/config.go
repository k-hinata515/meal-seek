package config

import (
	"log"
	"os"
	"github.com/joho/godotenv"
)

// アプリケーション全体の設定を保持
type AppConfig struct {
	HotPepperApiKey string
	FrontendURL     string
	GoServerPort    string
}

var Cfg AppConfig	// ロードされた設定値を保持するグローバル変数

func LoadConfig() {
	if err := godotenv.Load(); err != nil {
		log.Println(" .env ファイルが見つかりません")
	}

	Cfg.HotPepperApiKey = os.Getenv("HOTPEPPER_API_KEY")
	if Cfg.HotPepperApiKey == "" {
		log.Fatal("HOTPEPPER_API_KEY が設定されていません。")
	}

	Cfg.FrontendURL = os.Getenv("FRONTEND_URL")
	if Cfg.FrontendURL == "" {
		Cfg.FrontendURL = "http://localhost:5173" 
		log.Printf("FRONTEND_URL が設定されていません。デフォルト値 [%s] を使用します。", Cfg.FrontendURL)
	}

	Cfg.GoServerPort = os.Getenv("GO_SERVER_PORT")
	if Cfg.GoServerPort == "" {
		Cfg.GoServerPort = "5174" 
		log.Printf("GO_SERVER_PORT が設定されていません。デフォルト値 [%s] を使用します。", Cfg.GoServerPort)
	}
}