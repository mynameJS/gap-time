import { create } from 'zustand';

type CurrentLocationState = {
  currentLocation: google.maps.LatLngLiteral;
  setCurrentLocation: (currentLocation: google.maps.LatLngLiteral) => void;
};

const defaultCenter: google.maps.LatLngLiteral = {
  lat: 37.5665, // 서울 위도
  lng: 126.978, // 서울 경도
};

const useCurrentLocationStore = create<CurrentLocationState>(set => ({
  currentLocation: defaultCenter,
  setCurrentLocation: (currentLocation: google.maps.LatLngLiteral) => set({ currentLocation }),
}));

export default useCurrentLocationStore;
