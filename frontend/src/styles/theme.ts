export type TimeSlot = 'MORNING' | 'DAYTIME' | 'EVENING' | 'NIGHT';
export type ThemePreference = 'TIME_BASED' | 'SYSTEM_LIGHT' | 'SYSTEM_DARK';

export interface AppTheme {
    bodyBg: string;
    text: string;
    heading: string;
    accent1: string; // 推奨タグ背景・文字など
    accent2: string; // 通常タグ枠線・文字など
    button: string;  // 主要ボタン
    inputBg: string;
    inputFocusBorder: string;
    cardBg: string;
    headerBg: string;
    headerBorder: string;
}

export const timeThemes: Record<TimeSlot, AppTheme> = {
    // 各時間帯に応じた配色設定
    MORNING: {
        bodyBg: 'bg-sky-50', text: 'text-slate-700', heading: 'text-blue-700',
        accent1: 'bg-orange-100 text-orange-700', accent2: 'border-blue-300 text-blue-600',
        button: 'bg-orange-500 hover:bg-orange-600 text-white',
        inputBg: 'bg-white', inputFocusBorder: 'focus:border-orange-500 focus:ring-orange-500',
        cardBg: 'bg-white', headerBg: 'bg-white/80', headerBorder: 'border-slate-200',
    },
    DAYTIME: {
        bodyBg: 'bg-slate-50', text: 'text-slate-800', heading: 'text-sky-700',
        accent1: 'bg-sky-100 text-sky-700', accent2: 'border-teal-300 text-teal-600',
        button: 'bg-sky-500 hover:bg-sky-600 text-white',
        inputBg: 'bg-white', inputFocusBorder: 'focus:border-sky-500 focus:ring-sky-500',
        cardBg: 'bg-white', headerBg: 'bg-white/80', headerBorder: 'border-slate-200',
    },
    EVENING: {
        bodyBg: 'bg-indigo-100', text: 'text-slate-700', heading: 'text-purple-700',
        accent1: 'bg-red-100 text-red-700', accent2: 'border-pink-300 text-pink-600',
        button: 'bg-red-500 hover:bg-red-600 text-white',
        inputBg: 'bg-white', inputFocusBorder: 'focus:border-red-500 focus:ring-red-500',
        cardBg: 'bg-white', headerBg: 'bg-white/70', headerBorder: 'border-indigo-200',
    },
    NIGHT: {
        bodyBg: 'bg-slate-900', text: 'text-slate-200', heading: 'text-yellow-400',
        accent1: 'bg-gray-700 text-yellow-300', accent2: 'border-indigo-400 text-indigo-300',
        button: 'bg-yellow-500 hover:bg-yellow-600 text-slate-900',
        inputBg: 'bg-slate-800', inputFocusBorder: 'focus:border-yellow-500 focus:ring-yellow-500',
        cardBg: 'bg-slate-800', headerBg: 'bg-slate-800/80', headerBorder: 'border-slate-700',
    },
};

export const systemThemes: Record<'LIGHT' | 'DARK', AppTheme> = {
    LIGHT: { // ライトモード時の配色
        bodyBg: 'bg-slate-100', text: 'text-slate-800', heading: 'text-blue-700',
        accent1: 'bg-blue-100 text-blue-700', accent2: 'border-sky-300 text-sky-600',
        button: 'bg-blue-500 hover:bg-blue-600 text-white',
        inputBg: 'bg-white', inputFocusBorder: 'focus:border-blue-500 focus:ring-blue-500',
        cardBg: 'bg-white', headerBg: 'bg-white/90', headerBorder: 'border-gray-200',
    },
    DARK: { // ダークモード時の配色
        bodyBg: 'bg-slate-800', text: 'text-slate-100', heading: 'text-sky-400',
        accent1: 'bg-slate-700 text-sky-300', accent2: 'border-indigo-500 text-indigo-400',
        button: 'bg-sky-600 hover:bg-sky-700 text-white',
        inputBg: 'bg-slate-700', inputFocusBorder: 'focus:border-sky-500 focus:ring-sky-500',
        cardBg: 'bg-slate-700', headerBg: 'bg-slate-900/90', headerBorder: 'border-slate-700',
    },
};

export const getCurrentTimeSlot = (): TimeSlot => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'MORNING';
    if (hour >= 10 && hour < 17) return 'DAYTIME';
    if (hour >= 17 && hour < 20) return 'EVENING';
    return 'NIGHT';
};