import type { UserThemePreference } from '../../hooks/useThemeSwitcher'; 
import { FaSun, FaMoon } from 'react-icons/fa'; 

interface FooterProps {
    currentThemePreference: UserThemePreference; 
}

const Footer = ({ currentThemePreference }: FooterProps) => {
    const isDarkTheme = currentThemePreference === 'DARK';
    const year = new Date().getFullYear();
    const appName = "MealSeek"; 

    return (
        <footer className="app-footer"> 
        <div className="container mx-auto flex flex-col items-center justify-center space-y-2 py-4 md:py-6">
            <div className="mb-2">
            {isDarkTheme ? (
                <FaMoon className="w-6 h-6 text-dark-accent opacity-80" />
            ) : (
                <FaSun className="w-6 h-6 text-light-accent opacity-80" />
            )}
            </div>
            <p className="text-sm font-medium">
            お探しのレストランを、{appName}で見つけましょう。
            </p>
            <p className="opacity-80"> 
            &copy; {year} {appName}. All rights reserved.
            </p>
        </div>
        </footer>
    );
};

export default Footer;