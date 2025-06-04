import { type ShopType } from '../../../types/search';
import InfoItem from './InfoItem';
import SectionHeader from './SectionHeader';
import {FaMapMarkerAlt,FaRegClock,FaRegCalendarAlt,FaYenSign,FaUtensils,} from 'react-icons/fa';

interface BasicInfoCardProps {
    shop: ShopType | null;
}

const BasicInfoCard = ({ shop }: BasicInfoCardProps) => {
    if (!shop) {
        return null;
    }

    return (
        <div aria-labelledby="shop-basic-info-heading" className="p-4 md:p-6 rounded-lg shadow-lg border bg-white border-gray-200 dark:bg-slate-800 dark:border-slate-700">
            <SectionHeader icon={FaUtensils} title="店舗基本情報" />
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
                <InfoItem icon={FaMapMarkerAlt} label="住所" value={shop.address} />
                <InfoItem icon={FaRegClock} label="アクセス" value={shop.mobile_access} />
                <InfoItem icon={FaRegCalendarAlt} label="営業時間" value={shop.open} isHtml={true} />
                <InfoItem icon={FaRegCalendarAlt} label="定休日" value={shop.close} />
                {shop.budget && (
                <InfoItem
                    icon={FaYenSign}
                    label="予算"
                    value={
                    `${shop.budget.name || ''} ${shop.budget.average && shop.budget.average !== shop.budget.name ? `(${shop.budget.average})` : ''}`.trim()
                    }
                />
                )}
            </div>
        </div>
    );
};

export default BasicInfoCard;