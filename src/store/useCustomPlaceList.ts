import { create } from 'zustand';
import { ScheduleBlock } from '@/types/interface';

interface CustomPlaceListState {
  customPlaceList: ScheduleBlock[];
  setCustomPlaceList: (list: ScheduleBlock[]) => void;
}

const useCustomPlaceList = create<CustomPlaceListState>(set => ({
  customPlaceList: [],
  setCustomPlaceList: list => set({ customPlaceList: list }),
}));

export default useCustomPlaceList;
