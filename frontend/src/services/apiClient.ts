import axios, { AxiosError } from 'axios';
import { type SearchParams, type ShopType } from '../types/search';

// バックエンドAPIのベースURLを取得
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface ApiSearchResponse {
    shops: ShopType[];
    results_available: number;
    results_returned: number;
    results_start: number;
}

// レストラン検索のAPIを呼び出す関数
export const searchRestaurantsAPI = async (
    params: SearchParams,
    page: number = 1 
): Promise<{ shops: ShopType[]; totalResults: number; pageStart: number; pageReturned: number }> => {
    try {
        const itemsPerPage = 10; 
        const start = (page - 1) * itemsPerPage + 1;

        // APIリクエストのボディの構築
        const requestBody = {
        ...params,
        start: start,
        count: itemsPerPage,
        };
        // APIエンドポイントへのPOSTリクエスト
        const response = await axios.post<ApiSearchResponse>(`${API_BASE_URL}/hp/search`, requestBody);

        // レスポンスのデータの形式を確認
        if (response.data && Array.isArray(response.data.shops)) {
        return {
            shops: response.data.shops,
            totalResults: response.data.results_available || 0,
            pageStart: response.data.results_start || start,
            pageReturned: response.data.results_returned || response.data.shops.length,
        };
        } else {
            console.error('サーバーからのレスポンス形式が正しくありません。:', response.data);
            throw new Error('サーバーからのレスポンス形式が正しくありません。');
        }
    } catch (error) {
        console.error('レストランの検索中にエラーが発生しました:', error);
        if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string }>;
        if (axiosError.response && axiosError.response.data && axiosError.response.data.error) {
            throw new Error(axiosError.response.data.error);
        }
        throw new Error(axiosError.message || 'レストランの検索に失敗しました (通信エラー)。');
        }
        throw new Error('レストランの検索中に不明なエラーが発生しました。');
    }
};