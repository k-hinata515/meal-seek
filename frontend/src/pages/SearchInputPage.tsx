import { useState, type FormEvent } from 'react';
import { type SearchParams } from '../types/search';
import { ALL_GENRE_TAGS as allGenreTagsDataFromTheme , RADIUS_OPTIONS_DATA } from '../test/search_data';

import KeywordSearchInput from '../features/search/components/KeywordSearchField';
import SelectedFiltersDisplay from '../features/search/components/SelectedFiltersDisplay';
import SuggestedTags from '../features/search/components/SuggestedGenres';
import GenreFilter from '../features/search/components/GenreFilter';
import RadiusFilter from '../features/search/components/RadiusFilter'; 

const SearchInputPage = () => {

  const [keyword, setKeyword] = useState('');
  const [selectedGenreCodes, setSelectedGenreCodes] = useState<string[]>([]);
  const [selectedRadiusCode, setSelectedRadiusCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleKeywordChange = (newKeyword: string) => {
    setKeyword(newKeyword);
  };

  const handleGenreCodesChange = (updatedSelectedGenreCodes: string[]) => {
    setSelectedGenreCodes(updatedSelectedGenreCodes);
  };

  const handleRadiusChange = (newRadiusCode: string | null) => {
    setSelectedRadiusCode(newRadiusCode);
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    let lat, lng;
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000, maximumAge: 60000 })
      );
      lat = position.coords.latitude;
      lng = position.coords.longitude;
    } catch (geoError) {
      console.warn("位置情報取得失敗:", geoError);
      if (!selectedRadiusCode) { 
        alert("位置情報の取得に失敗しました。ブラウザの設定を確認するか、検索範囲を指定してください。");
        setIsLoading(false); return;
      }
    }
    const params: SearchParams = {};
    if (lat && lng) { params.lat = lat; params.lng = lng; }
    if (keyword.trim()) params.keyword = keyword.trim();
    if (selectedGenreCodes.length > 0) params.genreCodes = selectedGenreCodes;
    if (selectedRadiusCode) params.radiusCode = selectedRadiusCode;

    if (Object.keys(params).length === 0 || (Object.keys(params).length === 2 && params.lat && params.lng && !params.keyword && !params.genreCodes && !params.radiusCode)) {
      alert("検索条件を何か一つ以上指定してください（キーワード、ジャンル、または検索範囲）。"); setIsLoading(false); return;
    }

    console.log('Search Triggered (Params to send):', params);
    setTimeout(() => {
        const selectedGenreLabels = selectedGenreCodes.map(code => allGenreTagsDataFromTheme.find((g: { code: string; }) => g.code === code)?.label).filter(Boolean).join(', ');
        const selectedRadiusLabel = RADIUS_OPTIONS_DATA.find(r => r.code === selectedRadiusCode)?.label;
        alert(`検索実行（画面遷移はしません）:\nキーワード: ${params.keyword || '(なし)'}\nジャンル: ${selectedGenreLabels || '(なし)'}\n範囲: ${selectedRadiusLabel || '(なし)'}\n緯度: ${params.lat?.toFixed(4) || '(なし)'}\n経度: ${params.lng?.toFixed(4) || '(なし)'}`);
        setIsLoading(false);
    }, 1000);
  };

  const clearKeywordFilter = () => setKeyword('');
  const clearGenreFilter = (codeToClear: string) => {
    setSelectedGenreCodes(prev => prev.filter(code => code !== codeToClear));
  };
  const clearRadiusFilter = () => setSelectedRadiusCode(null);

  return (
    <div className="max-w-2xl mx-auto py-8 md:py-12 px-4">
      <div className="text-center mb-10 md:mb-16">
        <h2 className="search-page-heading text-3xl md:text-4xl">
          お店を探す
        </h2>
        <p className="text-gray-500 dark:text-slate-400 mt-2">
          レストランを見つけよう！！
        </p>
      </div>

      <div className="search-card space-y-6"> 
        <KeywordSearchInput
          keyword={keyword}
          onKeywordChange={handleKeywordChange}
          onSubmit={handleSubmit}
        />

        <SelectedFiltersDisplay
          keyword={keyword}
          selectedGenreCodes={selectedGenreCodes}
          selectedRadiusCode={selectedRadiusCode}
          allGenres={allGenreTagsDataFromTheme} 
          allRadiusOptions={RADIUS_OPTIONS_DATA}
          onClearKeyword={clearKeywordFilter}
          onClearGenre={clearGenreFilter}
          onClearRadius={clearRadiusFilter}
        />

        <SuggestedTags
          selectedGenreCodes={selectedGenreCodes}
          onGenreToggle={(code) => { 
            setSelectedGenreCodes(prev =>
              prev.includes(code) ? prev.filter(g => g !== code) : [...prev, code]
            );
          }}
        />

        <GenreFilter
          allGenres={allGenreTagsDataFromTheme} 
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
            disabled={isLoading}
            className="search-submit-button text-xl py-3" 
          >
            {isLoading ? '検索中...' : 'この条件でお店を探す'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchInputPage;