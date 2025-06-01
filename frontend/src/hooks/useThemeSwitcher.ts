import { useState, useEffect, useCallback } from 'react';
import { type UserThemePreference } from '../styles/theme'; 

const THEME_STORAGE_KEY = 'mealSeekThemePreference';

export const useThemeSwitcher = (): [UserThemePreference, (theme: UserThemePreference) => void] => {
    const [currentTheme, setCurrentTheme] = useState<UserThemePreference>(() => {
        //TODO: LocalStorageから前回の設定を読み込むか、OS設定をデフォルトにする
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as UserThemePreference | null;
        if (storedTheme) {
        return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'DARK' : 'LIGHT';
    });

    const applyTheme = useCallback((theme: UserThemePreference) => {
        const htmlEl = document.documentElement;
        if (theme === 'DARK') {
        htmlEl.classList.add('dark');
        htmlEl.classList.remove('light'); 
        } else {
        htmlEl.classList.remove('dark');
        htmlEl.classList.add('light'); 
        }
    }, []);

    useEffect(() => {
        applyTheme(currentTheme);
        localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    }, [currentTheme, applyTheme]);

    return [currentTheme, setCurrentTheme];
};

export type { UserThemePreference };
