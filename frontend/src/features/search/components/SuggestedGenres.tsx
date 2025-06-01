import { useMemo } from 'react';
import { useTimeSlot } from '../../../hooks/useTimeSlot';
import { TIME_BASED_RECOMMENDED_GENRE_CODES, ALL_GENRE_TAGS } from '../../../test/search_data';
import { FaLightbulb } from 'react-icons/fa'; 


interface SuggestedGenresProps {
    selectedGenreCodes: string[];
    onGenreToggle: (genreCode: string) => void;
}

const SuggestedGenres = ({
    selectedGenreCodes,
    onGenreToggle,
}: SuggestedGenresProps) => {
    const currentTimeSlot = useTimeSlot();

    const recommendedGenresToDisplay = useMemo(() => {
        const codes = TIME_BASED_RECOMMENDED_GENRE_CODES[currentTimeSlot] || [];
        return ALL_GENRE_TAGS.filter(tag => codes.includes(tag.code));
    }, [currentTimeSlot]); 

    if (recommendedGenresToDisplay.length === 0) {
        return null;
    }

    return (
        <section>
            <h3 className="search-section-heading text-lg">
                <FaLightbulb className="inline mr-2 mb-1 opacity-70" />
                {currentTimeSlot === 'MORNING' && '朝のおすすめジャンル'}
                {currentTimeSlot === 'DAYTIME' && '昼のおすすめジャンル'}
                {currentTimeSlot === 'EVENING' && '夕方のおすすめジャンル'}
                {currentTimeSlot === 'NIGHT' && '夜のおすすめジャンル'}
            </h3>
            <div className="flex flex-wrap gap-3 mt-3">
                {recommendedGenresToDisplay.map((tag) => (
                <button
                    type="button"
                    key={tag.id}
                    onClick={() => onGenreToggle(tag.code)}
                    className={`tag-button recommended ${ 
                    selectedGenreCodes.includes(tag.code) ? 'selected' : ''
                    } py-2 px-4`} 
                >
                    {tag.label}
                </button>
                ))}
            </div>
        </section>
    );
};

export default SuggestedGenres;