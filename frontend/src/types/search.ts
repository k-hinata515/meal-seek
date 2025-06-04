// 検索パラメータの型
export interface SearchParams {
    keyword?: string;
    genreCodes?: string[]; 
    radiusCode?: string;
    lat?: number;
    lng?: number;
}

// 店舗の予算情報を保持する型
export interface ShopBudget {
    code?: string;
    name?: string;
    average?: string;
}

// 店舗のURL情報を保持する型
export interface ShopUrls {
    pc?: string; 
    sp?: string;
}

// 店舗情報の型 
export interface ShopType {
    catch: string;
    id: string;
    name: string;
    address: string; 
    genre: {
        name: string;
        code: string;
        catch?: string;  
    };
    mobile_access: string;
    photo: {
        pc: {
            l: string;
            m: string;
            s: string;
        };
        mobile: {
            l: string;
            s: string;
        };
    }
    lat: number;
    lng: number;
    open?: string;
    close?: string; 
    budget?: ShopBudget;
    coupon_urls?: { 
        pc?: string;
        sp?: string;
    };
    urls?: ShopUrls; 
    card?: string;
    wifi?: string;
    non_smoking?: string;
    private_room?: string;
    free_food?: string;
    free_drink?: string; 
    parking?: string;
}

// タグの型
export interface FilterOption {
    id: string;
    label: string;
    code: string;
}