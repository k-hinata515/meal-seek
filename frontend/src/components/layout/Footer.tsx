import { type AppTheme } from '../../styles/theme';

interface FooterProps {
    currentTheme: AppTheme;
}

const Footer = ({ currentTheme }: FooterProps) => {
    return (
        <footer className={`text-center p-4 border-t ${currentTheme.headerBorder} ${currentTheme.headerBg.replace('/80','/30').replace('/90','/30')} mt-auto backdrop-blur-sm transition-colors duration-500`}>
            <p className={`text-xs ${currentTheme.text === 'text-slate-200' || currentTheme.text === 'text-slate-100' ? 'text-slate-500' : 'text-gray-500'}`}>
                &copy; {new Date().getFullYear()} MealSeek. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;