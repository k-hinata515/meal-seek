import {type FilterOption} from '../types/search';
import { type TimeSlot } from '../hooks/useTimeSlot';


// 全ジャンルデータ 
export const ALL_GENRE_TAGS: FilterOption[] = [
    { id: 'g001', label: '居酒屋', code: 'G001' },
    { id: 'g002', label: 'うどん', code: 'G002'},
    { id: 'g003', label: '創作料理', code: 'G003' }, 
    { id: 'g004', label: '和食', code: 'G004' },
    { id: 'g005', label: '洋食', code: 'G005' },
    { id: 'g006', label: 'イタリアン・フレンチ', code: 'G006' },
    { id: 'g007', label: '中華', code: 'G007' },
    { id: 'g008', label: '焼肉・ホルモン', code: 'G008' },
    { id: 'g010', label: '各国料理', code: 'G010'}, 
    { id: 'g011', label: 'カラオケ・パーティ', code: 'G011'},
    { id: 'g012', label: 'バー・カクテル', code: 'G012' },
    { id: 'g013', label: 'ラーメン', code: 'G013' },
    { id: 'g014', label: 'カフェ・スイーツ', code: 'G014' },
    { id: 'g015', label: 'お好み焼き・もんじゃ', code: 'G015'},
    { id: 'g017', label: '韓国料理', code: 'G017'},
];

// 時間帯別おすすめジャンルコードの定義
export const TIME_BASED_RECOMMENDED_GENRE_CODES: Record<TimeSlot, string[]> = {
  MORNING: ['G014'], 
  DAYTIME: ['G005', 'G006', 'G013'], 
  EVENING: ['G001', 'G002', 'G008'], 
  NIGHT: ['G012', 'G001'], 
};

export const RADIUS_OPTIONS_DATA: FilterOption[] = [
    { id: 'r1', label: '500m以内', code: '2' }, { id: 'r2', label: '1km以内', code: '3' },
    { id: 'r3', label: '3km以内', code: '5' },
];