// 検索パラメータの型
export interface SearchParams {
    keyword?: string;
    genreCodes?: string[]; 
    radiusCode?: string;
    lat?: number;
    lng?: number;
}

// 店舗情報の型 
export interface ShopType {
    id: string;
    name: string;
    genre: {
        name: string;
        code: string;
    };
    access: string;
    photo: string; 
    lat: number;
    lng: number;
}

// タグの型
export interface FilterOption {
    id: string;
    label: string;
    code: string;
}