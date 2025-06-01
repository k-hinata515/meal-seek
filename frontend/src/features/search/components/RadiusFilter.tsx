import { type FilterOption } from '../../../types/search'; 
import { FaMapMarkerAlt } from 'react-icons/fa';

interface RadiusFilterProps {
  radiusOptions: FilterOption[]; // 表示する半径の選択肢
  selectedRadiusCode: string | null; // 現在選択されている半径のコード
  onRadiusChange: (radiusCode: string | null) => void; // 半径選択が変更されたときに呼び出す関数
}

const RadiusFilter = ({
    radiusOptions,
    selectedRadiusCode,
    onRadiusChange,
}: RadiusFilterProps) => {
    if (!radiusOptions || radiusOptions.length === 0) {
        return null; 
    }

    return (
        <section>
        <h3 className="search-section-heading text-lg"> 
            <FaMapMarkerAlt className="inline mr-2 mb-1 opacity-70" />
            現在地からの範囲
        </h3>
        <div className="flex flex-wrap justify-center gap-3 mt-3">
            {radiusOptions.map((option) => (
            <button
                type="button"
                key={option.id}
                onClick={() => onRadiusChange(option.code === selectedRadiusCode ? null : option.code)}

                className={`tag-button filter ${
                selectedRadiusCode === option.code ? 'selected' : ''
                } py-2.5 px-5 text-base`} 
            >
                {option.label}
            </button>
            ))}
        </div>
        </section>
    );
};

export default RadiusFilter;