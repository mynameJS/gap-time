import { create } from 'zustand';
// import { ScheduleBlock } from '@/types/interface';

interface PolylineListState {
  polylineList: string[];
  setPolylineList: (list: string[]) => void;
}

const usePolylineListStore = create<PolylineListState>(set => ({
  polylineList: [],
  setPolylineList: list => set({ polylineList: list }),
}));

export default usePolylineListStore;
