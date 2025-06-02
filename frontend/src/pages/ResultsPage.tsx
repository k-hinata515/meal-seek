import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom';

import { type SearchParams, type ShopType } from '../types/search';
import { ALL_GENRE_TAGS as allGenreTagsDataFromTestData, RADIUS_OPTIONS_DATA } from '../test/search_data';
import { searchRestaurantsAPI } from '../services/apiClient';

import ResultsArea, { type ViewMode } from '../features/results/components/ResultsArea';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const ResultsPage = () => {
    const [searchParamsFromURL] = useSearchParams();
    const navigate = useNavigate();

    const [parsedSearchParams, setParsedSearchParams] = useState<SearchParams | null>(null);
    const [searchResults, setSearchResults] = useState<ShopType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [mapCenter, setMapCenter] = useState<[number, number]>([34.69, 135.50]);
    const [mapZoom, setMapZoom] = useState<number>(13);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        console.log("ResultsPage: URL Search Params changed:", searchParamsFromURL.toString());
        const keyword = searchParamsFromURL.get('keyword') || undefined;
        const genreQuery = searchParamsFromURL.get('genre');
        const genreCodes = genreQuery ? genreQuery.split(',') : undefined;
        const radiusCode = searchParamsFromURL.get('radius') || undefined;
        const latQuery = searchParamsFromURL.get('lat');
        const lngQuery = searchParamsFromURL.get('lng');
        const lat = latQuery ? parseFloat(latQuery) : undefined;
        const lng = lngQuery ? parseFloat(lngQuery) : undefined;

        if (!keyword && (!genreCodes || genreCodes.length === 0) && (!lat || !lng) && !radiusCode) {
        setError("検索条件が指定されていません。");
        setIsLoading(false);
        setParsedSearchParams(null);
        setSearchResults([]);
        setTotalResults(0);
        return;
        }
        setParsedSearchParams({ keyword, genreCodes, radiusCode, lat, lng });
    }, [searchParamsFromURL]);

    const fetchResults = useCallback(async (paramsToFetch: SearchParams | null, pageToFetch: number) => {
        if (!paramsToFetch) {
        setIsLoading(false);
        setSearchResults([]);
        setTotalResults(0);
        return;
        }

        setIsLoading(true);
        setError(null);
        if (pageToFetch === 1) setSearchResults([]);

        console.log(`ResultsPage: Fetching results (page ${pageToFetch}):`, paramsToFetch);

        try {
        
        const { shops: newShops, totalResults: apiTotalResults } = await searchRestaurantsAPI(paramsToFetch, pageToFetch);

        if (pageToFetch === 1) {
            setSearchResults(newShops);
        } else {
            setSearchResults(prevResults => [...prevResults, ...newShops]);
        }
        setTotalResults(apiTotalResults);

        if (newShops.length > 0 && pageToFetch === 1) {
            setMapCenter([newShops[0].lat, newShops[0].lng]);
            setMapZoom(15);
        } else if (newShops.length === 0 && pageToFetch === 1) {
            if (paramsToFetch.lat && paramsToFetch.lng) {
            setMapCenter([paramsToFetch.lat, paramsToFetch.lng]);
            setMapZoom(14);
            }
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

    useEffect(() => {
        if (parsedSearchParams) {
        setCurrentPage(1);
        fetchResults(parsedSearchParams, 1);
        } else {
        setSearchResults([]);
        setTotalResults(0);
        setIsLoading(false);
        }
    }, [parsedSearchParams, fetchResults]);

    const handleViewModeChange = (newMode: ViewMode) => setViewMode(newMode);
    const handleShopSelect = (shopId: string) => navigate(`/shop/${shopId}`);

    const handleLoadMore = () => {
        if (!isLoading && searchResults.length < totalResults) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchResults(parsedSearchParams, nextPage);
        }
    };

    const searchCriteriaDisplay = useMemo(() => {
        if (!parsedSearchParams) return "検索条件の読み込み中...";
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

    if (isLoading && currentPage === 1 && !error) {
        return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <LoadingSpinner />
            <p className="mt-4 text-lg text-gray-600 dark:text-slate-400">お店を探しています...</p>
        </div>
        );
    }

    if (error && searchResults.length === 0) {
        return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
            <ErrorMessage message={error} title="検索エラー" />
            <RouterLink to="/" className="mt-6 px-6 py-2 rounded-md text-sm font-medium transition-colors bg-light-accent text-white hover:opacity-90 dark:bg-dark-accent dark:text-dark-bg dark:hover:opacity-90">
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
            {!(isLoading && currentPage === 1) && !error && <p className="text-sm text-gray-500 dark:text-slate-400">{totalResults}件のお店が見つかりました</p>}
        </div>

        <ResultsArea
            shops={searchResults}
            isLoading={isLoading && currentPage === 1}
            error={null} 
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onShopSelect={handleShopSelect}
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            hasMore={searchResults.length < totalResults && !isLoading}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoading && currentPage > 1}
            searchRadiusCode={parsedSearchParams?.radiusCode}
            searchCenter={ 
                parsedSearchParams?.lat !== undefined && parsedSearchParams?.lng !== undefined
                ? [parsedSearchParams.lat, parsedSearchParams.lng]
                : undefined
            }
        />
        </div>
    );
};

export default ResultsPage;