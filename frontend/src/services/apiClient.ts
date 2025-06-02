import axios from 'axios';
import { type SearchParams, type ShopType } from '../types/search';

const API_BASE_URL = import.meta.env.VITE_API_URL

interface ApiSearchResponse {
    shops: ShopType[];
    results_available: number; 
    results_returned: number;
    results_start: number;
}

export const searchRestaurantsAPI = async (
    params: SearchParams,
    page: number = 1 
): Promise<{ shops: ShopType[]; totalResults: number }> => {
    try {
        const itemsPerPage = 10; 
        const start = (page - 1) * itemsPerPage + 1;

        const requestBody = {
        ...params,
        start: start,
        count: itemsPerPage,
        };

        console.log('Sending search request to backend:', requestBody);
        const response = await axios.post<ApiSearchResponse>(`${API_BASE_URL}/hp/search`, requestBody);
        
        if (response.data && response.data.shops) {
        return {
            shops: response.data.shops,
            totalResults: response.data.results_available || 0,
        };
        } else {
        console.error('Unexpected API response format:', response.data);
        return { shops: [], totalResults: 0 };
        }
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'レストランの検索に失敗しました。');
        }
        throw new Error('レストランの検索中に不明なエラーが発生しました。');
    }
};