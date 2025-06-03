import React from 'react';
import { type ShopType } from '../../../types/search';

interface ShopCardProps {
    shop: ShopType;
    onSelect: (shopId: string) => void;
}

const ShopCard = ({ shop, onSelect }: ShopCardProps) => {
    const handleCardClick = () => {
        onSelect(shop.id);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect(shop.id);
        }
    };

    const handleFavoriteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        alert(`店舗ID: ${shop.id} のお気に入り状態をトグルします（仮実装）`);
    };

    return (
        <div
        className="shop-card-base shop-card-themed flex flex-col h-full"
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`${shop.name}の詳細を見る`}
        >
        <img
            className="w-full h-40 object-cover rounded-t-lg flex-shrink-0"
            src={shop.photo.pc.m || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={`${shop.name}の画像`}
        />
        <div className="flex flex-col flex-grow p-4">
            <div className="flex justify-between items-start mb-1">
            <h3 className="shop-card-title-text text-base md:text-lg leading-tight pr-2 flex-grow line-clamp-2"> {/* index.css, 2行まで表示 */}
                {shop.name}
            </h3>
            <button
                onClick={handleFavoriteClick}
                aria-label="お気に入りに追加"
                className="p-1.5 rounded-full text-gray-400 hover:text-yellow-500 dark:text-slate-500 dark:hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 flex-shrink-0"
                title="お気に入り"
            >
                <svg className={`w-5 h-5 ${false ? 'text-yellow-400 fill-current' : 'fill-none stroke-current'}`} strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.846 5.671a1 1 0 00.95.69h5.968c.969 0 1.371 1.24.588 1.81l-4.828 3.522a1 1 0 00-.364 1.118l1.846 5.671c.3.921-.755 1.688-1.54 1.118l-4.828-3.522a1 1 0 00-1.176 0l-4.828 3.522c-.784.57-1.838-.197-1.539-1.118l1.846-5.671a1 1 0 00-.364-1.118L2.28 11.1c-.783-.57-.38-1.81.588-1.81h5.968a1 1 0 00.95-.69L11.049 2.927z"></path>
                </svg>
            </button>
            </div>
            {shop.genre && (
            <p className="shop-card-genre-text text-xs">
                {shop.genre.name}
            </p>
            )}
            <p className="shop-card-access-text mt-1.5 leading-snug line-clamp-3 text-xs flex-grow">
            {shop.mobile_access || "アクセス情報なし"}
            </p>
            <div className="mt-auto pt-2"> 
                <button onClick={handleCardClick} className="shop-card-detail-button"> 
                    詳細を見る
                </button>
            </div>
        </div>
        </div>
    );
};

export default ShopCard;