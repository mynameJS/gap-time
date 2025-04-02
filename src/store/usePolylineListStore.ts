import { create } from 'zustand';

interface PolylineListState {
  polylineList: string[];
  setPolylineList: (list: string[]) => void;
}

const usePolylineListStore = create<PolylineListState>(set => ({
  polylineList: [],
  setPolylineList: list => set({ polylineList: list }),
}));

export default usePolylineListStore;
