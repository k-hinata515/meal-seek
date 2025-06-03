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
    searchRadiusCode,
    searchCenter,
}: ResultsAreaProps) => {

    const handleTabChange = (newMode: ViewMode) => {
        if (viewMode !== newMode) {
        onViewModeChange(newMode);
        }
    };

    // 初回ロード時 (shopsがまだ空、isLoadingがtrue)
    if (isLoading && shops.length === 0) {
        return <LoadingSpinner text="お店情報を読み込んでいます..." className="py-10" />;
    }

    // エラー発生時 (shopsが空、errorが存在する)
    if (error && shops.length === 0) {
        return <ErrorMessage message={error} title="情報取得エラー" className="my-10" />;
    }

    // 検索結果が0件だった場合
    if (!isLoading && !error && shops.length === 0) { 
        return (
        <div className="text-center p-10 rounded-lg shadow-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2zm3-9V3a1 1 0 00-1-1H9a1 1 0 00-1 1v2" />
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-700 dark:text-slate-300">
            ご指定の条件に合うお店は見つかりませんでした。
            </p>
        </div>
        );
    }

    return (
        <div className="w-full">
        {/* 表示モード切り替えタブ */}
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

        {/* 結果表示エリア */}
        {viewMode === 'list' ? (
            <ShopList
            shops={shops}
            onShopSelect={onShopSelect}
            />
        ) : (
            <MapView
            shops={shops}
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            onShopPinClick={onShopSelect}
            searchRadiusCode={searchRadiusCode}
            searchCenter={searchCenter}
            />
        )}
        </div>
    );
};

export default ResultsArea;