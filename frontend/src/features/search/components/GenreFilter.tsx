import { useState, useMemo } from 'react';
import { type FilterOption} from '../../../types/search';
import { FaTags } from 'react-icons/fa'; 

interface GenreFilterProps {
    allGenres: FilterOption[];
    selectedGenreCodes: string[];
    onGenreChange: (selectedCodes: string[]) => void;
    initialVisibleCount?: number;
}

const GenreFilter = ({
    allGenres,
    selectedGenreCodes,
    onGenreChange,
    initialVisibleCount = 5,
}: GenreFilterProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const initiallyVisibleGenres = useMemo(
        () => allGenres.slice(0, initialVisibleCount),
        [allGenres, initialVisibleCount]
    );

    const handleTagToggleInList = (genreCode: string) => {
        const newSelected = selectedGenreCodes.includes(genreCode)
        ? selectedGenreCodes.filter(c => c !== genreCode)
        : [...selectedGenreCodes, genreCode];
        onGenreChange(newSelected);
    };

    const handleTagToggleInModal = handleTagToggleInList;

    return (
        <section>
        
        <h3 className="search-section-heading text-lg">
            <FaTags className="inline mr-2 mb-1 opacity-70" />
            ジャンル
        </h3> 
        <div className="flex flex-wrap gap-2 mt-3 items-center">
            {initiallyVisibleGenres.map((genre) => (
            <button
                type="button"
                key={genre.id}
                onClick={() => handleTagToggleInList(genre.code)}
                
                className={`tag-button filter ${
                selectedGenreCodes.includes(genre.code) ? 'selected' : ''
                } py-2 px-4`}
            >
                {genre.label}
            </button>
            ))}
            {allGenres.length > initialVisibleCount && (
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="more-genres-button" 
            >
                もっと見る...
            </button>
            )}
        </div>

        {isModalOpen && (
            <div className="modal-overlay">
            <div className="modal-content"> 
                <div className="modal-header"> 
                <h3 className="modal-title">ジャンルを選択</h3> 
                <button type="button" onClick={() => setIsModalOpen(false)} className="modal-close-button"> 
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                </div>
                <div className="modal-body scrollbar-thin">
                {allGenres.map((genre) => (
                    <button
                    type="button"
                    key={genre.id}
                    onClick={() => handleTagToggleInModal(genre.code)}
                    className={`modal-body-item-button ${
                        selectedGenreCodes.includes(genre.code) ? 'selected' : ''
                    } py-2.5`}
                    >
                    {genre.label}
                    </button>
                ))}
                </div>
                <div className="modal-footer"> 
                <button type="button" onClick={() => setIsModalOpen(false)} className="modal-footer-button"> 
                    選択完了
                </button>
                </div>
            </div>
            </div>
        )}
        </section>
    );
};

export default GenreFilter;