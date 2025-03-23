import { create } from 'zustand';

interface GeocodeItem {
  place_id: string;
  geocode: google.maps.LatLngLiteral;
}

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
