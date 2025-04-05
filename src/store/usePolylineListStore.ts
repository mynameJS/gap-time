import { create } from 'zustand';

interface PolylineListState {
  polylineList: string[];
  setPolylineList: (list: string[]) => void;
  clearPolylineList: () => void;
}

const usePolylineListStore = create<PolylineListState>(set => ({
  polylineList: [],
  setPolylineList: list => set({ polylineList: list }),
  clearPolylineList: () => set({ polylineList: [] }),
}));

export default usePolylineListStore;
