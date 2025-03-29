'use client';

import { VStack, HStack, Input, Button, Text, Icon, Image, Badge } from '@chakra-ui/react';
import { InputGroup } from '@/components/ui/input-group';
import { FaCheck, FaPlus, FaSearch, FaSyncAlt } from 'react-icons/fa';
import { FaMapLocationDot } from 'react-icons/fa6';
import { TargetedPlaceData, PlanInfo } from '@/types/interface';
import { PLACES_CATEGORY, DEFAULT_PLACES_CATEGORY } from '@/constants/place';
import getCurrentLocationAddress from '@/utils/location/getCurrentLocationAddress';
import { fetchNearbyPlacesDetail } from '@/lib/api/places';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import usePlanStore from '@/store/usePlanInfoStore';

interface PlaceSearchPanelProps {
  planInfo: PlanInfo | null;
  placeList: TargetedPlaceData[];
  setPlaceList: Dispatch<SetStateAction<TargetedPlaceData[]>>;
  selectedPlaces: TargetedPlaceData[];
  handleTogglePlace: (place: TargetedPlaceData) => void;
  setCurrentDetailData: (place: TargetedPlaceData) => void;
  toggleModalOpen: () => void;
}

function PlaceSearchPanel({
  planInfo,
  placeList,
  setPlaceList,
  selectedPlaces,
  handleTogglePlace,
  setCurrentDetailData,
  toggleModalOpen,
}: PlaceSearchPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(DEFAULT_PLACES_CATEGORY);
  const { updatePlanInfo } = usePlanStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const handleSearchPlaces = async () => {
    if (!planInfo) return;

    const fetchPlacesParams = {
      latitude: planInfo.geocode.lat,
      longitude: planInfo.geocode.lng,
      sortBy: 'distance',
      keyword: searchTerm,
    };

    try {
      const placeList = await fetchNearbyPlacesDetail(fetchPlacesParams);
      setPlaceList(placeList);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const handleRefreshLocation = async () => {
    try {
      const { geocode, formattedAddress } = await getCurrentLocationAddress();
      updatePlanInfo({
        geocode,
        formattedAddress,
      });
      alert('위치 데이터가 업데이트 되었습니다.');
    } catch (err: any) {
      console.error(err.message);
      alert(err.message);
    }
  };

  useEffect(() => {
    if (!planInfo) return;

    const fetchPlacesParams = {
      latitude: planInfo.geocode.lat,
      longitude: planInfo.geocode.lng,
      type: selectedCategory,
      sortBy: 'distance',
    };

    const fetchPlaces = async () => {
      try {
        const placeList = await fetchNearbyPlacesDetail(fetchPlacesParams);
        setPlaceList(placeList);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };
    fetchPlaces();
  }, [planInfo, selectedCategory, setPlaceList]);

  return (
    <VStack gap={2} w="50%" h="100%" align="stretch">
      <HStack w="100%" px={1}>
        <HStack gap={2}>
          <Icon as={FaMapLocationDot} boxSize={4} />
          <Text fontSize="sm" color="gray.800" fontWeight="semibold">
            {planInfo?.formattedAddress ?? '위치를 불러오는 중...'}
          </Text>
        </HStack>
        <Button
          onClick={handleRefreshLocation}
          size="sm"
          variant="ghost"
          colorScheme="gray"
          p={1}
          minW="auto"
          aria-label="현재 위치 새로고침">
          <Icon as={FaSyncAlt} boxSize={3} />
        </Button>
      </HStack>

      <InputGroup
        endElement={
          <Button variant="ghost" onClick={handleSearchPlaces} p={1}>
            <FaSearch />
          </Button>
        }
        w="100%">
        <Input
          placeholder="장소를 검색하세요..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={e => e.key === 'Enter' && handleSearchPlaces()}
        />
      </InputGroup>

      <HStack wrap="wrap">
        {Object.keys(PLACES_CATEGORY).map(category => (
          <Button
            key={category}
            variant={
              selectedCategory === PLACES_CATEGORY[category as keyof typeof PLACES_CATEGORY] ? 'solid' : 'outline'
            }
            colorPalette="blue"
            onClick={() => setSelectedCategory(PLACES_CATEGORY[category as keyof typeof PLACES_CATEGORY])}
            size="md">
            {category}
          </Button>
        ))}
      </HStack>

      <VStack align="stretch" gap={2} overflow={'auto'}>
        {placeList.map(place => {
          const isSelected = selectedPlaces.some(p => p.place_id === place.place_id);
          return (
            <HStack
              key={place.place_id}
              p={3}
              borderWidth={1}
              borderRadius="md"
              boxShadow="sm"
              w="100%"
              justify="space-between">
              <HStack>
                <Image src={place.photo_url ?? place.icon[0]} alt={place.name} boxSize="50px" borderRadius="md" />
                <VStack
                  align="start"
                  gap={1}
                  onClick={() => {
                    setCurrentDetailData(place);
                    toggleModalOpen();
                  }}
                  cursor={'pointer'}>
                  <Text fontSize="md" fontWeight="bold">
                    <Badge colorPalette="blue">{place.type}</Badge> {place.name}
                  </Text>
                  <Text fontSize="sm" color="gray.800">
                    {place.address}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    ⭐ {place.rating?.toFixed(1)} ({place.total_reviews?.toLocaleString()} 리뷰)
                  </Text>
                </VStack>
              </HStack>
              <Button
                size="sm"
                h="100%"
                colorPalette={isSelected ? 'green' : 'blue'}
                onClick={() => handleTogglePlace(place)}>
                <Icon as={isSelected ? FaCheck : FaPlus} />
              </Button>
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
}

export default PlaceSearchPanel;
