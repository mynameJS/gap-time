import { create } from 'zustand';
import { ScheduleBlock } from '@/types/interface';

interface CustomPlaceListState {
  customPlaceList: ScheduleBlock[];
  setCustomPlaceList: (list: ScheduleBlock[]) => void;
}

const useCustomPlaceListStore = create<CustomPlaceListState>(set => ({
  customPlaceList: [],
  setCustomPlaceList: list => set({ customPlaceList: list }),
}));

export default useCustomPlaceListStore;
