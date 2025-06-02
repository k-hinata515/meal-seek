import { type ShopType } from '../../../types/search';
import ShopCard from './ShopCard';

interface ShopListProps {
    shops: ShopType[];
    onShopSelect: (shopId: string) => void;
    isMore?: boolean;  
    onLoadMore?: () => void;
    isLoadingMore?: boolean;    
}

const ShopList = ({
    shops,
    onShopSelect,
    isMore,
    onLoadMore,
    isLoadingMore,
}: ShopListProps) => {
    if (shops.length === 0 && !isLoadingMore) {
        return <p className="text-center text-gray-500 dark:text-slate-400 py-10">表示できるお店がありません。</p>;
        // return null;
    }

    return (
        // TODO:グリッドレイアウトバージョンやってみて良さそうならコメントアウト外す
        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">  
        
        //シンプルなリスト表示バージョン
        <div className="space-y-4 md:space-y-6">
        {shops.map(shop => (
            <ShopCard
            key={shop.id}
            shop={shop}
            onSelect={onShopSelect}
            />
        ))}

        {isMore && onLoadMore && (
            <div className="mt-6 text-center">
            <button
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="search-submit-button py-2.5 text-base" 
            >
                {isLoadingMore ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    読み込み中...
                </div>
                ) : (
                'もっと見る'
                )}
            </button>
            </div>
        )}
        {/* {isLoadingMore && <LoadingSpinner text="さらに読み込み中..." className="py-4" />} */}
        {!isMore && shops.length > 0 && onLoadMore && !isLoadingMore && (
            <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-8 py-4 border-t border-dashed border-gray-300 dark:border-slate-700">
            これ以上お店はありません。
            </p>
        )}
        </div>
    );
};

export default ShopList;