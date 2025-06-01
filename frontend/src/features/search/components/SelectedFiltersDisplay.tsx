import { type FilterOption } from '../../../types/search';

interface SelectedFiltersDisplayProps {
    keyword: string;
    selectedGenreCodes: string[];
    selectedRadiusCode: string | null;
    allGenres: FilterOption[];
    allRadiusOptions: FilterOption[];
    onClearKeyword: () => void;
    onClearGenre: (genreCode: string) => void;
    onClearRadius: () => void;
}

const SelectedFiltersDisplay = ({
    keyword,
    selectedGenreCodes,
    selectedRadiusCode,
    allGenres,
    allRadiusOptions,
    onClearKeyword,
    onClearGenre,
    onClearRadius,
    }: SelectedFiltersDisplayProps) => {

    const selections: { type: 'keyword' | 'genre' | 'radius'; label: string; value: string; onClear: () => void }[] = [];

    if (keyword.trim()) {
        selections.push({
        type: 'keyword',
        label: keyword.trim(), 
        value: keyword.trim(),
        onClear: onClearKeyword,
        });
    }

    selectedGenreCodes.forEach(code => {
        const genre = allGenres.find(g => g.code === code);
        if (genre) {
        selections.push({
            type: 'genre',
            label: genre.label,
            value: code,
            onClear: () => onClearGenre(code),
        });
        }
    });

    if (selectedRadiusCode) {
        const radius = allRadiusOptions.find(r => r.code === selectedRadiusCode);
        if (radius) {
        selections.push({
            type: 'radius',
            label: radius.label, 
            value: selectedRadiusCode,
            onClear: onClearRadius,
        });
        }
    }

    if (selections.length === 0) {
        return null;
    }

    return (
        <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-800/70">
        <h4 className="text-xs font-semibold mb-2 text-gray-500 dark:text-slate-400">
            選択中の条件:
        </h4>
        <div className="flex flex-wrap gap-2">
            {selections.map(sel => (
            <div
                key={`${sel.type}-${sel.value}`}
                className={`selected-filter-display-tag 
                ${sel.type === 'keyword' ? 'selected-filter-display-tag-keyword' : ''}
                ${sel.type === 'genre' ? 'selected-filter-display-tag-genre' : ''}
                ${sel.type === 'radius' ? 'selected-filter-display-tag-radius' : ''}
                `}
            >
                <span>{sel.label}</span>
                <button
                type="button"
                onClick={sel.onClear}
                className="ml-1.5 p-0.5 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-100 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-slate-500"
                aria-label={`${sel.label} を解除`}
                >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                    />
                </svg>
                </button>
            </div>
            ))}
        </div>
        </div>
    );
};

export default SelectedFiltersDisplay;