import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L, { DivIcon, type LatLngExpression, type LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type ShopType } from '../../../types/search';


// マップのデフォルトアイコンを設定
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapViewProps {
    shops: ShopType[];
    mapCenter: [number, number]; 
    mapZoom: number;
    searchRadiusCode?: string | null; 
    searchCenter?: [number, number] | null; 
    onShopPinClick: (shopId: string) => void;
}

const ChangeMapView = ({ center, zoom, bounds }: { center?: LatLngExpression; zoom?: number; bounds?: LatLngBoundsExpression }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
        map.fitBounds(bounds, { padding: [50, 50] });   
        } else if (center && zoom) {
        map.setView(center, zoom);
        }
    }, [center, zoom, bounds, map]);
    return null;
};

const createCustomShopIcon = (shop: ShopType): DivIcon => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const borderColor = isDarkTheme ? 'border-yellow-400' : 'border-sky-500';
    const pinColor = isDarkTheme ? 'border-t-yellow-400' : 'border-t-sky-500';
    const tooltipBg = isDarkTheme ? 'bg-slate-700 text-slate-200' : 'bg-white text-slate-700';

    const iconHtml = `
        <div class="custom-map-pin group relative flex flex-col items-center cursor-pointer w-10 h-12 transform transition-transform duration-150 ease-in-out hover:z-10 hover:scale-110">
        <img
            src="${shop.photo || 'https://via.placeholder.com/40x40?text=NoImg'}"
            alt="${shop.name}"
            class="w-8 h-8 object-cover rounded-full border-2 ${borderColor} shadow-lg"
        />
        <div class="absolute -bottom-1.5 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] ${pinColor} border-l-transparent border-r-transparent"></div>
        <div
            class="absolute top-full mt-1.5 whitespace-nowrap px-2.5 py-1.5 text-xs ${tooltipBg} rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-150 delay-100 transform -translate-x-1/2 left-1/2 pointer-events-none"
            style="min-width: 100px; text-align: center;"
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

    const bounds = useMemo(() => {
        if (shops.length > 0) {
        const latLngs = shops.map(shop => [shop.lat, shop.lng] as L.LatLngTuple);
        return L.latLngBounds(latLngs);
        }
        return undefined;
    }, [shops]);
    const radiusInMeters = useMemo(() => {
        if (!searchRadiusCode) return null;
        switch (searchRadiusCode) {
        case '1': return 300;
        case '2': return 500;
        case '3': return 1000;
        case '4': return 2000; 
        case '5': return 3000; 
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
            <ChangeMapView bounds={bounds} center={!bounds ? mapCenter : undefined} zoom={!bounds ? mapZoom : undefined} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {searchCenter && radiusInMeters && (
            <Circle
                center={searchCenter}
                radius={radiusInMeters}
                pathOptions={{
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.1,
                weight: 1,
                }}
            />
            )}
            {searchCenter && (
            <Marker position={searchCenter} icon={L.icon({ 
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
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
                icon={createCustomShopIcon(shop)}
            >
                <Popup offset={[0, -42]}>
                    <div className="w-48 p-1">
                        <img
                        src={shop.photo || 'https://via.placeholder.com/150?text=No+Image'}
                        alt={shop.name}
                        className="w-full h-24 object-cover rounded-md mb-2"
                        />
                        <h4 className="font-semibold text-sm text-gray-800 dark:text-slate-100 truncate">
                        {shop.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-slate-300 truncate">
                        {shop.genre.name}
                        </p>
                        <button
                        onClick={() => onShopPinClick(shop.id)}
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