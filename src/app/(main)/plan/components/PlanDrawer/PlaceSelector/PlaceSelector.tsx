'use client';

import { Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import useCustomPlaceListStore from '@/store/useCustomPlaceListStore';
import useGeocodeListStore from '@/store/useGeocodeListStore';
import usePlanStore from '@/store/usePlanInfoStore';
import { PlaceDetails } from '@/types/interface';
import getTimeBlocks from '@/utils/plan/getTimeBlocks';
import PlaceAIRecommend from './PlaceAIRecommend';
import PlaceSearchPanel from './PlaceSearchPanel';
import PlaceSelectionPanel from './PlaceSelectionPanel';

// ✅ PlaceDetailModal을 동적 import로 지연 로딩
const PlaceDetailModal = dynamic(() => import('../PlaceDetailModal'), {
  ssr: false,
  loading: () => null,
});

interface PlaceSelectorProps {
  currentDetailData: PlaceDetails | undefined | null;
  isDetailModalOpen: boolean;
  setCurrentDetailData: (place: PlaceDetails) => void;
  onToggle: () => void;
}

function PlaceSelector({ currentDetailData, isDetailModalOpen, setCurrentDetailData, onToggle }: PlaceSelectorProps) {
  const { planInfo } = usePlanStore();
  const { addGeocode, removeGeocodeById } = useGeocodeListStore();
  const { setCustomPlaceList } = useCustomPlaceListStore();
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceDetails[]>([]);

  const count = planInfo ? getTimeBlocks(planInfo.startTime[0], planInfo.endTime[0]).length : 0;

  const handleTogglePlace = (place: PlaceDetails) => {
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

  if (!planInfo) return null;

  return (
    <Flex flexDir={{ base: 'column', md: 'row' }} w="100%" h="100%" p={4}>
      <PlaceSearchPanel
        planInfo={planInfo}
        selectedPlaces={selectedPlaces}
        onPlaceSelect={handleTogglePlace}
        setCurrentDetailData={setCurrentDetailData}
        onToggle={onToggle}
      />
      <PlaceSelectionPanel
        planInfo={planInfo}
        selectedPlaces={selectedPlaces}
        setSelectedPlaces={setSelectedPlaces}
        setCustomPlaceList={setCustomPlaceList}
        removeGeocodeById={removeGeocodeById}
        count={count}
      />
      <PlaceAIRecommend onPlaceSelect={handleTogglePlace} selectedPlaces={selectedPlaces} />
      {isDetailModalOpen && currentDetailData && (
        <PlaceDetailModal
          currentDetailData={currentDetailData}
          isDetailModalOpen={isDetailModalOpen}
          onToggle={onToggle}
        />
      )}
    </Flex>
  );
}

export default PlaceSelector;
