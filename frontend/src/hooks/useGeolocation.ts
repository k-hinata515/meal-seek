// frontend/src/hooks/useGeolocation.ts
import { useState, useCallback } from 'react';

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    error: GeolocationPositionError | string | null; 
    isLoading: boolean; 
}

interface GeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}

const useGeolocation = (options?: GeolocationOptions) => {
    const [location, setLocation] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        error: null,
        isLoading: false,
    });

    const getLocation = useCallback(() => {
        if (!navigator.geolocation) {
        setLocation(prev => ({
            ...prev,
            error: "お使いのブラウザは位置情報取得に対応していません。",
            isLoading: false,
        }));
        return Promise.reject(new Error("Geolocation not supported"));
        }

        setLocation(prev => ({ ...prev, isLoading: true, error: null }));

        return new Promise<GeolocationCoordinates>((resolve, reject) => { 
        navigator.geolocation.getCurrentPosition(
            (position) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
                isLoading: false,
            });
            resolve(position.coords); 
            },
            (geoError) => {
            let errorMessage = "位置情報の取得に失敗しました。";
            switch (geoError.code) {
                case geoError.PERMISSION_DENIED:
                errorMessage = "位置情報の利用が許可されていません。ブラウザやOSの設定を確認してください。";
                break;
                case geoError.POSITION_UNAVAILABLE:
                errorMessage = "現在位置を取得できませんでした。";
                break;
                case geoError.TIMEOUT:
                errorMessage = "位置情報の取得がタイムアウトしました。";
                break;
                default:
                errorMessage = `位置情報の取得中に不明なエラーが発生しました (コード: ${geoError.code})。`;
                break;
            }
            setLocation(prev => ({
                ...prev,
                error: errorMessage, 
                isLoading: false,
            }));
            reject(new Error(errorMessage)); 
            },
            { // Geolocationオプション
            enableHighAccuracy: options?.enableHighAccuracy ?? false,
            timeout: options?.timeout ?? 10000,
            maximumAge: options?.maximumAge ?? 60000 * 1,
            }
        );
        });
    }, [options]); 

    return { ...location, getLocation }; 
};

export default useGeolocation;