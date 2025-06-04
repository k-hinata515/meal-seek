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
            className="w-full h-80 object-cover rounded-t-lg flex-shrink-0"
            src={shop.photo.pc.l}
            alt={`${shop.name}の画像`}
        />
        <div className="flex flex-col flex-grow p-4">
            <div className="flex justify-between items-start mb-1">
            <h3 className="shop-card-title-text text-base md:text-lg leading-tight pr-2 flex-grow line-clamp-2"> {/* index.css, 2行まで表示 */}
                {shop.name}
            </h3>
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