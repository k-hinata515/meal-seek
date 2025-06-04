import { type UserThemePreference } from '../../hooks/useThemeSwitcher';
import { FaSun, FaMoon } from 'react-icons/fa'; // アイコンライブラリを使用する場合

interface HeaderProps {
    currentThemePreference: UserThemePreference;
    onThemeToggle: () => void;
}

const Header = ({ currentThemePreference, onThemeToggle }: HeaderProps) => {

    return (
        <header className="app-header">
        <div className="container mx-auto flex justify-between items-center">
            <h1 className="app-header-title"> 
            MealSeek
            </h1>
            <nav className="flex items-center space-x-4">
            <button
                onClick={onThemeToggle}
                title={`テーマを${currentThemePreference === 'LIGHT' ? 'ダーク' : 'ライト'}に切り替え`}
                className="theme-toggle-button" 
            >
                {currentThemePreference === 'LIGHT' ? (
                <FaMoon className="w-5 h-5" />
                ) : (
                <FaSun className="w-5 h-5" />
                )}
            </button>
            </nav>
        </div>
        </header>
    );
};

export default Header;