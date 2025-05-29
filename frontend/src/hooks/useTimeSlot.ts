// frontend/src/hooks/useTimeSlot.ts
import { useState} from 'react';
import { type TimeSlot, getCurrentTimeSlot as utilGetCurrentTimeSlot } from '../styles/theme';

export const useTimeSlot = (): TimeSlot => {
    // アプリ起動時に一度だけ時間帯を判定
    const [timeSlot] = useState<TimeSlot>(() => utilGetCurrentTimeSlot());

    return timeSlot;
};

