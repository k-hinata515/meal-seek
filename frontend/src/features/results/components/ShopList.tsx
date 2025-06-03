import { type ShopType } from '../../../types/search';
import ShopCard from './ShopCard';

interface ShopListProps {
    shops: ShopType[]; 
    onShopSelect: (shopId: string) => void;
}

const ShopList = ({ shops, onShopSelect }: ShopListProps) => {
    if (shops.length === 0) {
        return null;
    }

    return (
        // グリッドレイアウト
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {shops.map(shop => (
            <ShopCard
            key={shop.id}
            shop={shop}
            onSelect={onShopSelect}
            />
        ))}
        </div>
    );
};
export default ShopList;