import {type AppTheme, type ThemePreference } from '../../styles/theme';

interface HeaderProps {
    currentTheme: AppTheme; // 現在適用されているテーマの配色情報
    themePreference: ThemePreference;
    onThemePreferenceChange: (preference: ThemePreference) => void;
}

const Header = ({ currentTheme, themePreference, onThemePreferenceChange }: HeaderProps) => {
    const isLoggedIn = false; // ダミー

    const getNextPreference = (): ThemePreference => {
        if (themePreference === 'TIME_BASED') return 'SYSTEM_LIGHT'; // 時間帯 -> システム(ライト)
        if (themePreference === 'SYSTEM_LIGHT') return 'SYSTEM_DARK'; // システム(ライト) -> システム(ダーク)
        return 'TIME_BASED'; // システム(ダーク) -> 時間帯
    };

    const getPreferenceLabel = () => {
        if (themePreference === 'TIME_BASED') return '時間帯連動';
        if (themePreference === 'SYSTEM_LIGHT') return 'ライトテーマ';
        if (themePreference === 'SYSTEM_DARK') return 'ダークテーマ';
        return '';
    };

    return (
        <header className={`p-4 shadow-md sticky top-0 z-50 ${currentTheme.headerBg} backdrop-blur-md border-b ${currentTheme.headerBorder} transition-colors duration-500`}>
        <div className="container mx-auto flex justify-between items-center">
            <h1 className={`text-2xl font-bold ${currentTheme.heading}`}>MealSeek</h1>
            <nav className="flex items-center space-x-4">
            <button
                onClick={() => onThemePreferenceChange(getNextPreference())}
                title={`現在のテーマ: ${getPreferenceLabel()} (クリックで切替)`}
                className={`px-3 py-1.5 text-xs rounded-md ${currentTheme.accent2} ${currentTheme.text === 'text-slate-200' || currentTheme.text === 'text-slate-100' ? 'bg-slate-700 hover:bg-slate-600' :'bg-white hover:bg-gray-100'} border shadow-sm`}
            >
                {getPreferenceLabel()}
            </button>
            {isLoggedIn ? (
                <>
                {/* ... (ログイン済みメニュー) ... */}
                <button className={`px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 ${currentTheme.text}`}>ログアウト</button>
                </>
            ) : (
                <>
                <button className={`px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 ${currentTheme.text}`}>ログイン</button>
                <button className={`px-4 py-1.5 text-sm font-semibold rounded-md shadow-sm ${currentTheme.button} transition-colors duration-300`}>登録</button>
                </>
            )}
            </nav>
        </div>
        </header>
    );
};

export default Header;