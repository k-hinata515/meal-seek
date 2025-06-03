import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom';

import { type SearchParams, type ShopType } from '../types/search';
import { ALL_GENRE_TAGS as allGenreTagsDataFromTestData, RADIUS_OPTIONS_DATA } from '../test/search_data';
import { searchRestaurantsAPI } from '../services/apiClient';

import ResultsArea, { type ViewMode } from '../features/results/components/ResultsArea';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import PaginationControls from '../features/results/components/PaginationControls';

const ITEMS_PER_PAGE = 10;

const ResultsPage = () => {
    const [searchParamsFromURL, setSearchParamsFromURL] = useSearchParams();
    const navigate = useNavigate();

    const [parsedSearchParams, setParsedSearchParams] = useState<SearchParams | null>(null);
    const [searchResults, setSearchResults] = useState<ShopType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [mapCenter, setMapCenter] = useState<[number, number]>([34.69, 135.50]);
    const [mapZoom, setMapZoom] = useState<number>(13);
    
    const [currentPage, setCurrentPage] = useState(() => {
        const pageFromUrl = searchParamsFromURL.get('page');
        return pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
    });
    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        const keyword = searchParamsFromURL.get('keyword') || undefined;
        const genreQuery = searchParamsFromURL.get('genre');
        const genreCodes = genreQuery ? genreQuery.split(',') : undefined;
        const radiusCode = searchParamsFromURL.get('radius') || undefined;
        const latQuery = searchParamsFromURL.get('lat');
        const lngQuery = searchParamsFromURL.get('lng');
        const lat = latQuery ? parseFloat(latQuery) : undefined;
        const lng = lngQuery ? parseFloat(lngQuery) : undefined;
        
        const pageFromUrl = searchParamsFromURL.get('page');
        const newPageFromUrl = pageFromUrl ? parseInt(pageFromUrl, 10) : 1;

        if (!keyword && (!genreCodes || genreCodes.length === 0) && (!lat || !lng) && !radiusCode) {
        setError("検索条件が指定されていません。");
        setIsLoading(false);
        setParsedSearchParams(null);
        setSearchResults([]);
        setTotalResults(0);
        return;
        }
        setParsedSearchParams({ keyword, genreCodes, radiusCode, lat, lng });
        // URLのページと現在のページが異なれば更新 
        if (currentPage !== newPageFromUrl) {
        setCurrentPage(newPageFromUrl);
        }
    }, [searchParamsFromURL, currentPage]);

    // 検索実行関数
    const fetchResults = useCallback(async (paramsToFetch: SearchParams | null, pageToFetch: number) => {
        if (!paramsToFetch) {
        setIsLoading(false);
        setSearchResults([]);
        setTotalResults(0);
        return;
        }
        setIsLoading(true);
        setError(null);
        setSearchResults([]);

        try {
        const { shops: newShops, totalResults: apiTotalResults } = await searchRestaurantsAPI(paramsToFetch, pageToFetch);
        setSearchResults(newShops); 
        setTotalResults(apiTotalResults);

        if (newShops.length > 0) {
            setMapCenter([newShops[0].lat, newShops[0].lng]);
            setMapZoom(15);
        } else if (paramsToFetch.lat && paramsToFetch.lng) {
            setMapCenter([paramsToFetch.lat, paramsToFetch.lng]);
            setMapZoom(14);
        }
        } catch (err) {
        console.error("Error in fetchResults:", err);
        setError(err instanceof Error ? err.message : '検索結果の取得中に不明なエラーが発生しました。');
        setSearchResults([]);
        setTotalResults(0);
        } finally {
        setIsLoading(false);
        }
    }, []);

    // 検索条件またはページが変更されたらAPI呼び出し
    useEffect(() => {
        if (parsedSearchParams) {
        // URLのpageクエリパラメータを現在のcurrentPageと同期させる
        const currentUrlParams = new URLSearchParams(searchParamsFromURL.toString());
        const pageInUrl = currentUrlParams.get('page');
        if (pageInUrl !== currentPage.toString()) {
            currentUrlParams.set('page', currentPage.toString());
            setSearchParamsFromURL(currentUrlParams, { replace: true });
        }
        fetchResults(parsedSearchParams, currentPage);
        }
    }, [parsedSearchParams, currentPage, fetchResults, searchParamsFromURL, setSearchParamsFromURL]);


    const handleViewModeChange = (newMode: ViewMode) => setViewMode(newMode);
    const handleShopSelect = (shopId: string) => navigate(`/shop/${shopId}`);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
        setCurrentPage(newPage);
        }
    };
    
    const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

    const searchCriteriaDisplay = useMemo(() => {
        if (!parsedSearchParams) return "検索条件を読み込み中...";
        const parts = [];
        if (parsedSearchParams.keyword) parts.push(`キーワード: "${parsedSearchParams.keyword}"`);
        if (parsedSearchParams.genreCodes && parsedSearchParams.genreCodes.length > 0) {
        const genreLabels = parsedSearchParams.genreCodes
            .map(code => allGenreTagsDataFromTestData.find(g => g.code === code)?.label)
            .filter(Boolean)
            .join('、');
        if (genreLabels) parts.push(`ジャンル: ${genreLabels}`);
        }
        if (parsedSearchParams.radiusCode) {
        const radiusLabel = RADIUS_OPTIONS_DATA.find(r => r.code === parsedSearchParams.radiusCode)?.label;
        if (radiusLabel) parts.push(`範囲: ${radiusLabel}`);
        }
        if (parts.length === 0 && parsedSearchParams.lat && parsedSearchParams.lng) {
            return "現在地周辺のお店";
        }
        return parts.length > 0 ? parts.join(' / ') : "お店";
    }, [parsedSearchParams]);

    if (isLoading && searchResults.length === 0 && !error) {
        return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <LoadingSpinner text="お店を探しています..." />
        </div>
        );
    }

    if (error && searchResults.length === 0) {
        return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
            <ErrorMessage message={error} title="検索エラー" />
            <RouterLink to="/" className="mt-6 px-6 py-2 rounded-md text-sm font-medium transition-colors app-button-primary">
            検索条件に戻る
            </RouterLink>
        </div>
        );
    }

    return (
        <div className="w-full space-y-4 md:space-y-6">
        <div className="px-4 md:px-0">
            <RouterLink to="/" className="mb-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-sky-400 dark:hover:text-sky-300">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            検索条件に戻る
            </RouterLink>
            <h2 className="search-page-heading text-2xl md:text-3xl mb-1">
            「{searchCriteriaDisplay}」の検索結果
            </h2>
            {!(isLoading && searchResults.length === 0) && !error && (
            <p className="text-sm text-gray-500 dark:text-slate-400">
                {totalResults > 0 ? `${totalResults}件中 ${((currentPage - 1) * ITEMS_PER_PAGE) + 1} - ${Math.min(currentPage * ITEMS_PER_PAGE, totalResults)}件を表示` : "お店は見つかりませんでした"}
            </p>
            )}
        </div>
        
        <ResultsArea
            shops={searchResults} 
            isLoading={isLoading && searchResults.length === 0}
            error={null}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onShopSelect={handleShopSelect}
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            searchRadiusCode={parsedSearchParams?.radiusCode}
            searchCenter={
                parsedSearchParams?.lat !== undefined && parsedSearchParams?.lng !== undefined
                ? [parsedSearchParams.lat, parsedSearchParams.lng]
                : undefined
            }
        />
        {totalResults > 0 && totalPages > 1 && (
            <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            />
        )}
        </div>
    );
};
export default ResultsPage;