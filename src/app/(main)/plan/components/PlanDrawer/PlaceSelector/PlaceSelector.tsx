// components/PlaceSelector/PlaceSelector.tsx
'use client';

import { useState } from 'react';
import { HStack } from '@chakra-ui/react';
import usePlanStore from '@/store/usePlanInfoStore';
import useGeocodeListStore from '@/store/useGeocodeListStore';
import useCustomPlaceListStore from '@/store/useCustomPlaceListStore';
import { TargetedPlaceData } from '@/types/interface';
import PlaceSearchPanel from './PlaceSearchPanel';
import PlaceSelectionPanel from './PlaceSelectionPanel';
import PlaceDetailModal from './PlaceDetailModal';

function PlaceSelector() {
  const { planInfo } = usePlanStore();
  const { addGeocode, removeGeocodeById } = useGeocodeListStore();
  const { setCustomPlaceList } = useCustomPlaceListStore();

  const [placeList, setPlaceList] = useState<TargetedPlaceData[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<TargetedPlaceData[]>([]);
  const [currentDetailData, setCurrentDetailData] = useState<TargetedPlaceData>();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleTogglePlace = (place: TargetedPlaceData) => {
    const isSelected = selectedPlaces.some(p => p.place_id === place.place_id);
    if (isSelected) {
      setSelectedPlaces(prev => prev.filter(p => p.place_id !== place.place_id));
      removeGeocodeById(place.place_id);
    } else {
      setSelectedPlaces(prev => [...prev, place]);
      if (place.geocode) addGeocode({ place_id: place.place_id, geocode: place.geocode });
    }
  };

  const toggleModalOpen = () => setIsDetailModalOpen(prev => !prev);

  return (
    <HStack w="100%" h="100%" p={4} borderWidth={3} borderRadius="md" boxShadow="sm">
      <PlaceSearchPanel
        planInfo={planInfo}
        placeList={placeList}
        setPlaceList={setPlaceList}
        selectedPlaces={selectedPlaces}
        handleTogglePlace={handleTogglePlace}
        setCurrentDetailData={setCurrentDetailData}
        toggleModalOpen={toggleModalOpen}
      />
      <PlaceSelectionPanel
        planInfo={planInfo}
        selectedPlaces={selectedPlaces}
        setSelectedPlaces={setSelectedPlaces}
        setCustomPlaceList={setCustomPlaceList}
        removeGeocodeById={removeGeocodeById}
      />
      {isDetailModalOpen && currentDetailData && (
        <PlaceDetailModal
          currentDetailData={currentDetailData}
          isDetailModalOpen={isDetailModalOpen}
          onToggle={toggleModalOpen}
        />
      )}
    </HStack>
  );
}

export default PlaceSelector;
