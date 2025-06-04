import { type ShopType } from '../../../types/search'; 
import InfoItem from './InfoItem';
import SectionHeader from './SectionHeader';
import {
    FaWifi, FaCreditCard, FaParking, FaGlassCheers, FaUtensils, FaInfoCircle
} from 'react-icons/fa';

interface FacilitiesCardProps {
    shop: ShopType | null;
}

const FacilitiesCard = ({ shop }: FacilitiesCardProps) => {
    if (!shop) {
        return null;
    }

    const facilityItems = [
        { icon: FaCreditCard, label: "カード利用", value: shop.card },
        { icon: FaWifi, label: "WiFi", value: shop.wifi },
        { icon: FaParking, label: "駐車場", value: shop.parking },
        { icon: FaUtensils, label: "個室", value: shop.private_room },
        { icon: FaGlassCheers, label: "飲み放題", value: shop.free_drink },
        { icon: FaUtensils, label: "食べ放題", value: shop.free_food },
    ];

    const validItems = facilityItems.filter(item =>
        item.value &&
        String(item.value).trim() !== "" &&
        String(item.value).toLowerCase() !== "なし" &&
        String(item.value).toLowerCase() !== "不明"
    );

    if (validItems.length === 0) {
        return (
            <section aria-labelledby="shop-facility-info-heading" className="p-4 md:p-6 rounded-lg shadow-lg border bg-white border-gray-200 dark:bg-slate-800 dark:border-slate-700">
                <SectionHeader icon={FaInfoCircle} title="設備・サービス" />
                <p className="text-sm text-gray-500 dark:text-slate-400">利用可能な設備・サービス情報はありません。</p>
            </section>
        );
    }

    return (
        <section aria-labelledby="shop-facility-info-heading" className="p-4 md:p-6 rounded-lg shadow-lg border bg-white border-gray-200 dark:bg-slate-800 dark:border-slate-700">
        <SectionHeader icon={FaInfoCircle} title="設備・サービス" />
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {validItems.map((item, index) => (
            <InfoItem
                key={index}
                icon={item.icon}
                label={item.label}
                value={item.value}
            />
            ))}
        </div>
        </section>
    );
};

export default FacilitiesCard;