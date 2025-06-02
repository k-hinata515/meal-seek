import { type ShopType } from '../../../types/search';

import ShopList from './ShopList';
import MapView from './MapView';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ErrorMessage from '../../../components/ui/ErrorMessage';

export type ViewMode = 'list' | 'map';

interface ResultsAreaProps {
    shops: ShopType[];
    isLoading: boolean;
    error: string | null;
    viewMode: ViewMode;
    onViewModeChange: (newMode: ViewMode) => void;
    onShopSelect: (shopId: string) => void;

    mapCenter: [number, number];
    mapZoom: number;

    hasMore?: boolean;
    onLoadMore?: () => void;
    isLoadingMore?: boolean;

    searchRadiusCode?: string | null; 
    searchCenter?: [number, number] | undefined;
}

const ResultsArea = ({
    shops,
    isLoading,
    error,
    viewMode,
    onViewModeChange,
    onShopSelect,
    mapCenter,
    mapZoom,
    hasMore,
    onLoadMore,
    isLoadingMore,
    searchRadiusCode,
    searchCenter,
}: ResultsAreaProps) => {

    const handleTabChange = (newMode: ViewMode) => {
        if (viewMode !== newMode) {
        onViewModeChange(newMode);
        }
    };

    if (isLoading && shops.length === 0) {
        return <LoadingSpinner />;
    }

    if (error && shops.length === 0) {
        return <ErrorMessage message={error} title="検索エラー" />;
    }

    if (!isLoading && !error && shops.length === 0) {
        return (
        <div className="text-center p-10 rounded-lg shadow-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <p className="text-lg text-gray-700 dark:text-slate-300">
            ご指定の条件に合うお店は見つかりませんでした。
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
            検索条件を変更して、再度お試しください。
            </p>
        </div>
        );
    }

    return (
        <div className="w-full">
        <div className="flex justify-center mb-4 md:mb-6">
            <button
            onClick={() => handleTabChange('list')}
            aria-pressed={viewMode === 'list'}
            className={`results-tab-button results-tab-button-list ${
                viewMode === 'list' ? 'selected' : ''
            }`}
            >
            リスト表示
            </button>
            <button
            onClick={() => handleTabChange('map')}
            aria-pressed={viewMode === 'map'}
            className={`results-tab-button results-tab-button-map ${
                viewMode === 'map' ? 'selected' : ''
            }`}
            >
            地図表示
            </button>
        </div>

        {viewMode === 'list' ? (
            <ShopList
            shops={shops}
            onShopSelect={onShopSelect}
            hasMore={hasMore}
            onLoadMore={onLoadMore}
            isLoadingMore={isLoadingMore}
            />
        ) : (
            <MapView
            shops={shops}
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            onShopPinClick={onShopSelect}
            searchRadiusCode={searchRadiusCode} 
            searchCenter={searchCenter ? [searchCenter[0], searchCenter[1]] : undefined} 
            />
        )}
        </div>
    );
};

export default ResultsArea;