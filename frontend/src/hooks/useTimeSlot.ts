import { useState } from 'react';

export type TimeSlot = 'MORNING' | 'DAYTIME' | 'EVENING' | 'NIGHT';

export const getCurrentTimeSlot = (): TimeSlot => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'MORNING';
    if (hour >= 10 && hour < 17) return 'DAYTIME';
    if (hour >= 17 && hour < 20) return 'EVENING';
    return 'NIGHT';
};

export const useTimeSlot = (): TimeSlot => {
    const [timeSlot] = useState<TimeSlot>(() => getCurrentTimeSlot());
    return timeSlot;
};