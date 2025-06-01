import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useThemeSwitcher } from '../../hooks/useThemeSwitcher';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const [currentTheme, setCurrentTheme] = useThemeSwitcher();

    return (
        <div className="flex flex-col min-h-screen">
        <Header
            currentThemePreference={currentTheme}
            onThemeToggle={() => setCurrentTheme(currentTheme === 'LIGHT' ? 'DARK' : 'LIGHT')}
        />
        <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
            {children}
        </main>
        <Footer currentThemePreference={currentTheme} />
        </div>
    );
};

export default MainLayout;