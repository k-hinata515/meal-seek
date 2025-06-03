import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L, { DivIcon, type LatLngExpression, type LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type ShopType } from '../../../types/search';


if (L.Icon.Default.prototype instanceof L.Icon.Default && '_getIconUrl' in L.Icon.Default.prototype) {
    delete L.Icon.Default.prototype._getIconUrl;
}
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapViewProps {
    shops: ShopType[];
    mapCenter: [number, number]; // 地図の中心座標(緯度, 経度)
    mapZoom: number;
    searchRadiusCode?: string | null;
    searchCenter?: [number, number] | null | undefined; // 検索中心座標(緯度, 経度)
    onShopPinClick: (shopId: string) => void;
}

// 地図の中心やズームレベル、境界を動的に変更するためのヘルパーコンポーネント
const ChangeMapView = ({ center, zoom, bounds }: { center?: LatLngExpression; zoom?: number; bounds?: LatLngBoundsExpression }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
        map.fitBounds(bounds, { padding: [50, 50] }); // 店舗群が収まるように、少しパディングを持たせる
        } else if (center && zoom !== undefined) { // zoomもチェック
        map.setView(center, zoom);
        }
    }, [center, zoom, bounds, map]);
    return null;
};

//カスタムピンアイコンを作成する関数
const createCustomShopIcon = (shop: ShopType): DivIcon => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const borderColorClass = isDarkTheme ? 'border-dark-accent' : 'border-light-accent'; // tailwind.config.jsの色名に合わせる
    const pinTipColorClass = isDarkTheme ? 'border-t-dark-accent' : 'border-t-light-accent';
    const tooltipBgClass = isDarkTheme ? 'bg-slate-700 text-slate-200' : 'bg-white text-slate-700';

    const iconHtml = `
        <div class="custom-map-pin group relative flex flex-col items-center cursor-pointer w-10 h-12 transform transition-transform duration-150 ease-in-out hover:z-10 hover:scale-110">
        <img
            src="${shop.photo.pc.s || 'https://via.placeholder.com/40x40?text=NoImg'}"
            alt="${shop.name}"
            class="w-8 h-8 object-cover rounded-full border-2 ${borderColorClass} shadow-lg"
        />
        <div class="absolute -bottom-1.5 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] ${pinTipColorClass} border-l-transparent border-r-transparent"></div>
        <div
            class="absolute top-full mt-1.5 whitespace-nowrap px-2.5 py-1.5 text-xs ${tooltipBgClass} rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-150 delay-100 transform -translate-x-1/2 left-1/2 pointer-events-none"
            style="min-width: 100px; text-align: center; z-index: 1000;"
        >
            ${shop.name}
        </div>
        </div>
    `;
    return L.divIcon({
        html: iconHtml,
        className: 'bg-transparent border-none',
        iconSize: [32, 40], 
        iconAnchor: [16, 40],
        popupAnchor: [0, -42]
    });
    };

    const MapView = ({ shops, mapCenter, mapZoom, searchRadiusCode, searchCenter, onShopPinClick }: MapViewProps) => {
    if (!shops || shops.length === 0) {
        return (
        <div className="h-[400px] md:h-[500px] w-full rounded-lg shadow-md flex items-center justify-center bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <p className="text-gray-500 dark:text-slate-400">地図に表示できるお店がありません。</p>
        </div>
        );
    }

    // 検索結果が収まるように地図の表示範囲を計算
    const bounds = useMemo(() => {
        if (shops.length > 0) {
        const latLngs = shops.map(shop => [shop.lat, shop.lng] as L.LatLngTuple);
        return L.latLngBounds(latLngs);
        }
        return undefined;
    }, [shops]);

    // 検索半径をメートル単位に変換
    const radiusInMeters = useMemo(() => {
        if (!searchRadiusCode) return null;
        switch (searchRadiusCode) {
        case '1': return 300;
        case '2': return 500;
        case '3': return 1000;
        case '4': return 2000; 
        case '5': return 3000
        default: return null;
        }
    }, [searchRadiusCode]);

    return (
        <div className="h-[400px] md:h-[500px] w-full rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-slate-700 relative">
        <MapContainer
            center={!bounds ? mapCenter : undefined} 
            zoom={!bounds ? mapZoom : undefined}
            bounds={bounds} 
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
        >
            {/* 地図表示の更新をハンドリング */}
            <ChangeMapView bounds={bounds} center={!bounds ? mapCenter : undefined} zoom={!bounds ? mapZoom : undefined} />
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 検索中心と検索半径の円を表示 */}
            {searchCenter && radiusInMeters && (
            <Circle
                center={searchCenter as LatLngExpression} 
                radius={radiusInMeters}
                pathOptions={{ 
                color: '#3182CE',
                fillColor: '#3182CE',
                fillOpacity: 0.1,
                weight: 1,
                }}
            />
            )}
            {searchCenter && ( // 検索中心点マーカー
            <Marker position={searchCenter as LatLngExpression} icon={L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', // シンプルなデフォルトアイコン
                iconSize: [12, 20],
                iconAnchor: [6, 20],
                })}>
                <Popup>検索の中心</Popup>
            </Marker>
            )}
            {shops.map(shop => (
            <Marker
                key={shop.id}
                position={[shop.lat, shop.lng]}
                icon={createCustomShopIcon(shop)} // カスタムアイコンを使用
            >
                <Popup offset={[0, -42]}> {/* ポップアップの位置を調整 */}
                <div className="w-48 p-1"> {/* ポップアップの幅を指定 */}
                    <img
                    src={shop.photo.pc.m || 'https://via.placeholder.com/150?text=No+Image'}
                    alt={shop.name}
                    className="w-full h-24 object-cover rounded-md mb-2"
                    />
                    <h4 className="font-semibold text-sm text-gray-800 dark:text-slate-100 truncate">
                    {shop.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-slate-300 truncate">
                    {shop.genre.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {shop.mobile_access || "アクセス情報なし"}
                    </p>
                    <button
                    onClick={() => onShopPinClick(shop.id)}
                    // index.css の .shop-card-detail-button を参考にテーマ対応
                    className="mt-2 w-full text-xs py-1.5 px-2 rounded-md transition-colors
                                bg-light-accent text-white hover:opacity-90
                                dark:bg-dark-accent dark:text-dark-bg dark:hover:opacity-90"
                    >
                    詳細を見る
                    </button>
                </div>
                </Popup>
            </Marker>
            ))}
        </MapContainer>
        </div>
    );
};

export default MapView;