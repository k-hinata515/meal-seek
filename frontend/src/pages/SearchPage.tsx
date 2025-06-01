import { useState, useCallback, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { type SearchParams } from '../types/search';
import { ALL_GENRE_TAGS as allGenreTagsDataFromTestData, RADIUS_OPTIONS_DATA } from '../test/search_data';

import KeywordSearchField from '../features/search/components/KeywordSearchField';
import SelectedFiltersDisplay from '../features/search/components/SelectedFiltersDisplay';
import SuggestedGenres from '../features/search/components/SuggestedGenres';
import GenreFilter from '../features/search/components/GenreFilter';
import RadiusFilter from '../features/search/components/RadiusFilter';
import useGeolocation from '../hooks/useGeolocation';

const SearchPage = () => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [selectedGenreCodes, setSelectedGenreCodes] = useState<string[]>([]);
  const [selectedRadiusCode, setSelectedRadiusCode] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const {
    error: geolocationError,
    isLoading: isLoadingGeolocation,
    getLocation
  } = useGeolocation({ timeout: 8000, maximumAge: 60000 });

  const handleKeywordChange = (newKeyword: string) => setKeyword(newKeyword);
  const handleGenreCodesChange = (updatedSelectedGenreCodes: string[]) => setSelectedGenreCodes(updatedSelectedGenreCodes);
  const handleRadiusChange = (newRadiusCode: string | null) => setSelectedRadiusCode(newRadiusCode);

  const handleSubmit = useCallback(async (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (!keyword.trim() && selectedGenreCodes.length === 0 && !selectedRadiusCode) {
      alert("検索条件を何か一つ以上指定してください。");
      return;
    }

    setIsSearching(true); 

    let lat: number | undefined = undefined;
    let lng: number | undefined = undefined;

    try {
      const coords = await getLocation();
      lat = coords.latitude;
      lng = coords.longitude;
    } catch (error) { 
      console.error("Submit Geolocation error:", error);
      setIsSearching(false);
      return;
    }

    // 位置情報取得成功後
    const params: SearchParams = { lat, lng };
    if (keyword.trim()) params.keyword = keyword.trim();
    if (selectedGenreCodes.length > 0) params.genreCodes = selectedGenreCodes;
    if (selectedRadiusCode) params.radiusCode = selectedRadiusCode;

    // クエリパラメータを生成
    const query = new URLSearchParams();
    if (params.keyword) query.set('keyword', params.keyword);
    if (params.genreCodes && params.genreCodes.length > 0) query.set('genre', params.genreCodes.join(','));
    if (params.radiusCode) query.set('radius', params.radiusCode);
    if (params.lat !== undefined) query.set('lat', params.lat.toString());
    if (params.lng !== undefined) query.set('lng', params.lng.toString());

    setIsSearching(false);
    navigate(`/results?${query.toString()}`);

  }, [keyword, selectedGenreCodes, selectedRadiusCode, navigate, getLocation]);

  const clearKeywordFilter = () => setKeyword('');
  const clearGenreFilter = (codeToClear: string) => setSelectedGenreCodes(prev => prev.filter(code => code !== codeToClear));
  const clearRadiusFilter = () => setSelectedRadiusCode(null);

  return (
    <div className="max-w-2xl mx-auto py-8 md:py-12 px-4">
      <div className="text-center mb-10 md:mb-16">
        <h2 className="search-page-heading text-3xl md:text-4xl">
          お店を探す
        </h2>
        <p className="text-gray-500 dark:text-slate-400 mt-2">
          キーワードや条件を指定して、お気に入りのお店を見つけましょう。
        </p>
      </div>

      {/* Geolocationのローディング中やエラーメッセージ */}
      {isLoadingGeolocation && <p className="text-center text-sm text-gray-500 dark:text-slate-400 mb-4">位置情報取得中...</p>}
      {geolocationError && !isLoadingGeolocation && (
        <p className="text-center text-sm text-red-500 dark:text-red-400 mb-4">
          {typeof geolocationError === 'string'
            ? geolocationError
            : geolocationError.message}
        </p>
      )}

      <div className="search-card space-y-6">
        <KeywordSearchField
          keyword={keyword}
          onKeywordChange={handleKeywordChange}
          onSubmit={handleSubmit}
        />
        <SelectedFiltersDisplay
          keyword={keyword}
          selectedGenreCodes={selectedGenreCodes}
          selectedRadiusCode={selectedRadiusCode}
          allGenres={allGenreTagsDataFromTestData}
          allRadiusOptions={RADIUS_OPTIONS_DATA}
          onClearKeyword={clearKeywordFilter}
          onClearGenre={clearGenreFilter}
          onClearRadius={clearRadiusFilter}
        />
        <SuggestedGenres
          selectedGenreCodes={selectedGenreCodes}
          onGenreToggle={(code) => setSelectedGenreCodes(prev => prev.includes(code) ? prev.filter(g => g !== code) : [...prev, code])}
        />
        <GenreFilter
          allGenres={allGenreTagsDataFromTestData}
          selectedGenreCodes={selectedGenreCodes}
          onGenreChange={handleGenreCodesChange}
        />
        <RadiusFilter
          radiusOptions={RADIUS_OPTIONS_DATA}
          selectedRadiusCode={selectedRadiusCode}
          onRadiusChange={handleRadiusChange}
        />
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSearching || isLoadingGeolocation} // 位置情報取得中も検索ボタンを無効化
            className="search-submit-button text-xl py-3"
          >
            {(isSearching || isLoadingGeolocation) ? '処理中...' : 'この条件でお店を探す'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;