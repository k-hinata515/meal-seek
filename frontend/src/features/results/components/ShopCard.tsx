import { type ShopType } from '../../../types/search';

interface ShopCardProps {
    shop: ShopType;
    onSelect: (shopId: string) => void;
}

const ShopCard = ({ shop, onSelect }: ShopCardProps) => {
    return (
        <div
        className="shop-card-base shop-card-themed flex flex-col sm:flex-row items-start sm:space-x-4"
        onClick={() => onSelect(shop.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(shop.id)}}
        >
        <img
            className="w-full sm:w-32 h-32 sm:h-24 object-cover rounded-lg sm:rounded-md mb-3 sm:mb-0 flex-shrink-0"
            src={shop.photo || 'https://via.placeholder.com/168x120?text=No+Image'}
            alt={shop.name}
        />
        <div className="flex-grow min-w-0"> 
            <div className="flex justify-between items-start">
            <h3 className="shop-card-title-text text-base md:text-lg leading-tight pr-2">
                {shop.name}
            </h3>
            <button aria-label="お気に入り" className="p-1 text-gray-400 hover:text-yellow-500 dark:text-slate-500 dark:hover:text-yellow-400">
                <svg className={`w-5 h-5 ${false ? 'text-yellow-400 fill-current' : 'fill-none stroke-current'}`} strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.846 5.671a1 1 0 00.95.69h5.968c.969 0 1.371 1.24.588 1.81l-4.828 3.522a1 1 0 00-.364 1.118l1.846 5.671c.3.921-.755 1.688-1.54 1.118l-4.828-3.522a1 1 0 00-1.176 0l-4.828 3.522c-.784.57-1.838-.197-1.539-1.118l1.846-5.671a1 1 0 00-.364-1.118L2.28 11.1c-.783-.57-.38-1.81.588-1.81h5.968a1 1 0 00.95-.69L11.049 2.927z"></path></svg>
            </button>
            </div>
            {shop.genre && (
            <p className="shop-card-genre-text text-xs mt-1">
                {shop.genre.name}
            </p>
            )}
            <p className="shop-card-access-text mt-1.5 leading-snug">
            {shop.access}
            </p>
            <button className="shop-card-detail-button mt-3">詳細を見る</button>
        </div>
        </div>
    );
};

export default ShopCard;