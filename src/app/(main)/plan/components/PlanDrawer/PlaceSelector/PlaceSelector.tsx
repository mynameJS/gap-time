// components/PlaceSelector/PlaceSelector.tsx
'use client';

import { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import usePlanStore from '@/store/usePlanInfoStore';
import useGeocodeListStore from '@/store/useGeocodeListStore';
import useCustomPlaceListStore from '@/store/useCustomPlaceListStore';
import { TargetedPlaceData } from '@/types/interface';
import PlaceSearchPanel from './PlaceSearchPanel';
import PlaceSelectionPanel from './PlaceSelectionPanel';
import PlaceDetailModal from './PlaceDetailModal';
import getTimeBlocks from '@/utils/plan/getTimeBlocks';

function PlaceSelector() {
  const { planInfo } = usePlanStore();
  const { addGeocode, removeGeocodeById } = useGeocodeListStore();
  const { setCustomPlaceList } = useCustomPlaceListStore();

  const [placeList, setPlaceList] = useState<TargetedPlaceData[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<TargetedPlaceData[]>([]);
  const [currentDetailData, setCurrentDetailData] = useState<TargetedPlaceData>();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const count = planInfo ? getTimeBlocks(planInfo.startTime[0], planInfo.endTime[0]).length : 0;

  const handleTogglePlace = (place: TargetedPlaceData) => {
    const isSelected = selectedPlaces.some(p => p.place_id === place.place_id);
    if (isSelected) {
      setSelectedPlaces(prev => prev.filter(p => p.place_id !== place.place_id));
      removeGeocodeById(place.place_id);
    } else {
      if (selectedPlaces.length === count) {
        return alert('설정된 일정의 시간을 초과할 수 없습니다.');
      }
      setSelectedPlaces(prev => [...prev, place]);
      if (place.geocode) addGeocode({ place_id: place.place_id, geocode: place.geocode });
    }
  };

  const toggleModalOpen = () => setIsDetailModalOpen(prev => !prev);

  return (
    <Flex flexDir={{ base: 'column', md: 'row' }} w="100%" h="100%" p={4}>
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
        count={count}
      />
      {isDetailModalOpen && currentDetailData && (
        <PlaceDetailModal
          currentDetailData={currentDetailData}
          isDetailModalOpen={isDetailModalOpen}
          onToggle={toggleModalOpen}
        />
      )}
    </Flex>
  );
}

export default PlaceSelector;
