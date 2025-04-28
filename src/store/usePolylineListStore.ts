import { create } from 'zustand';
import { PolylineStep } from '@/types/interface';

interface PolylineListState {
  polylineList: PolylineStep[];
  setPolylineList: (list: PolylineStep[]) => void;
  clearPolylineList: () => void;
}

const usePolylineListStore = create<PolylineListState>(set => ({
  polylineList: [],
  setPolylineList: list => set({ polylineList: list }),
  clearPolylineList: () => set({ polylineList: [] }),
}));

export default usePolylineListStore;
