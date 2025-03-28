import { create } from 'zustand';
import { GeocodeItem } from '@/types/interface';

interface GeocodeListState {
  geocodeList: GeocodeItem[];
  setGeocodeList: (list: GeocodeItem[]) => void;
  addGeocode: (item: GeocodeItem) => void;
  removeGeocodeById: (placeId: string) => void;
  clearGeocodeList: () => void;
}

const useGeocodeListStore = create<GeocodeListState>(set => ({
  geocodeList: [],
  setGeocodeList: list => set({ geocodeList: list }),
  addGeocode: item =>
    set(state => ({
      geocodeList: [...state.geocodeList, item],
    })),
  removeGeocodeById: placeId =>
    set(state => ({
      geocodeList: state.geocodeList.filter(item => item.place_id !== placeId),
    })),
  clearGeocodeList: () => set({ geocodeList: [] }),
}));

export default useGeocodeListStore;
