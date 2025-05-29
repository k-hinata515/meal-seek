// frontend/src/components/layout/MainLayout.tsx
import { type ReactNode, useState, useEffect, useMemo } from 'react';
import Header from './Header';
import Footer from './Footer'; // 作成したFooterをインポート
import { useTimeSlot } from '../../hooks/useTimeSlot';
import { timeThemes, systemThemes, type AppTheme, type ThemePreference } from '../../styles/theme';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const initialTimeSlot = useTimeSlot(); // アプリ起動時の時間帯
    const [themePreference, setThemePreference] = useState<ThemePreference>('TIME_BASED');
    const [osTheme, setOsTheme] = useState<'LIGHT' | 'DARK'>('LIGHT');

    // OSのテーマ設定を監視 
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => setOsTheme(mediaQuery.matches ? 'DARK' : 'LIGHT');
        handleChange(); // 初期値を設定
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const currentTheme = useMemo((): AppTheme => {
        if (themePreference === 'TIME_BASED') {
            return timeThemes[initialTimeSlot];
        }
        if (themePreference === 'SYSTEM_LIGHT') {
            return systemThemes.LIGHT;
        }
        return systemThemes.DARK;
    }, [themePreference, initialTimeSlot, osTheme]);


    useEffect(() => {
        document.body.className = '';
        currentTheme.bodyBg.split(' ').forEach(cls => document.body.classList.add(cls));
    }, [currentTheme.bodyBg]);


    return (
        <div className={`flex flex-col min-h-screen ${currentTheme.text} transition-colors duration-500 ease-in-out`}>
        <Header
            currentTheme={currentTheme}
            themePreference={themePreference}
            onThemePreferenceChange={setThemePreference}
        />
        <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
            {children}
        </main>
        <Footer currentTheme={currentTheme} />
        </div>
    );
};

export default MainLayout;