interface InfoItemProps {
    icon?: React.ElementType;
    label: string;
    value?: string | null | undefined | number;
    isHtml?: boolean;
    className?: string;
}

const InfoItem = ({ icon: IconComponent, label, value, isHtml = false, className = '' }: InfoItemProps) => {
    const valueString = String(value).trim();
    if (value === null || value === undefined || valueString === "" || valueString.toLowerCase() === "なし" || valueString.toLowerCase() === "不明") {
        return null;
    }
    const IconElem = IconComponent;
    return (
        <div className={`flex items-start py-3 border-b border-gray-100 dark:border-slate-700 last:border-b-0 ${className}`}>
        {IconElem && (
            <IconElem className="w-5 h-5 mt-1 mr-3 text-light-accent dark:text-dark-accent flex-shrink-0 opacity-80" />
        )}
        <div className="flex-grow min-w-0">
            <span className="font-semibold text-sm text-gray-700 dark:text-slate-300 min-w-[80px] inline-block">{label}:</span>{' '}
            {isHtml ? (
            <span className="text-sm text-gray-600 dark:text-slate-400 break-words" dangerouslySetInnerHTML={{ __html: valueString.replace(/\n/g, '<br />') }} />
            ) : (
            <span className="text-sm text-gray-600 dark:text-slate-400 break-words">{valueString}</span>
            )}
        </div>
        </div>
    );
};
export default InfoItem;