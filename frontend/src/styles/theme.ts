export type UserThemePreference = 'LIGHT' | 'DARK';
export type TimeSlot = 'MORNING' | 'DAYTIME' | 'EVENING' | 'NIGHT';

export const getHtmlThemeClasses = (
    currentTheme: UserThemePreference
): string[] => {
    if (currentTheme === 'DARK') {
        return ['dark']; 
    }
    return []; 
};

