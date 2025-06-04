interface SectionHeaderProps {
    icon?: React.ElementType;
    title: string;
    className?: string;
}

const SectionHeader = ({ icon: IconComponent, title, className = '' }: SectionHeaderProps) => {
    const IconElem = IconComponent;
    return (
        <h2 className={`text-xl font-semibold mb-4 text-light-heading dark:text-dark-heading flex items-center ${className}`}>
        {IconElem && <IconElem className="mr-2.5 opacity-90 text-2xl" />}
        {title}
        </h2>
    );
};
export default SectionHeader;