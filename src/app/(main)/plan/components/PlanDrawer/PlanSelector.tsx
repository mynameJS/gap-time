'use client';

import { useState, useEffect } from 'react';
import { Box, VStack, HStack, Input, Checkbox, Button, Text, Icon, List } from '@chakra-ui/react';
import { InputGroup } from '@/components/ui/input-group';
import { FaTrashAlt } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';
import usePlanStore from '@/store/usePlanInfoStore';
import { fetchNearbyPlaces } from '@/lib/api/places';
import PlaceCard from './PlaceCard';

interface targetedPlaceData {
  id: string;
  name: string;
  photo_reference?: string;
  rating: number;
  total_reviews: number;
  type: string;
  icon: [string, string];
  checked: boolean;
}

export default function PlanSelector() {
  const [searchTerm, setSearchTerm] = useState('');
  const [placeList, setPlaceList] = useState<targetedPlaceData[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<targetedPlaceData[]>([]);
  const { planInfo } = usePlanStore();

  // 🔍 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 📍 장소 선택 핸들러
  const handleTogglePlace = (placeId: string) => {
    setPlaceList(prev => prev.map(place => (place.id === placeId ? { ...place, checked: !place.checked } : place)));
  };

  // ➕ 선택한 장소 추가
  const handleAddPlaces = () => {
    const selected = placeList.filter(place => place.checked);
    setSelectedPlaces(prev => [...prev, ...selected]);
    setPlaceList(prev => prev.map(place => ({ ...place, checked: false }))); // 체크 초기화
  };

  // ❌ 선택한 장소 삭제
  const handleRemovePlace = (placeId: string) => {
    setSelectedPlaces(prev => prev.filter(place => place.id !== placeId));
  };

  // 📡 Google Places API에서 장소 가져오기
  useEffect(() => {
    if (!planInfo) return;

    const fetchPlacesParams = {
      latitude: planInfo.geocode.lat,
      longitude: planInfo.geocode.lng,
      radius: 5000,
      type: 'tourist_attraction',
    };

    const fetchPlaces = async () => {
      try {
        const placeList = await fetchNearbyPlaces(fetchPlacesParams);
        const targetedData = placeList.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          photo_reference: place.photos?.[0]?.photo_reference || null,
          rating: place.rating,
          total_reviews: place.user_ratings_total,
          type: place.types[0],
          icon: [place.icon, place.icon_background_color],
          checked: false, // 초기 선택 상태 false
        }));
        setPlaceList(targetedData);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };
    fetchPlaces();
  }, [planInfo]);

  return (
    <Box w="100%" h={'100vh'} p={4} borderWidth={1} borderRadius="md" boxShadow="sm" overflow={'auto'}>
      <VStack gap={4} align="stretch">
        {/* 🔍 검색 바 */}
        <InputGroup endElement={<CiSearch />} w="100%">
          <Input placeholder="장소를 검색하세요..." value={searchTerm} onChange={handleSearchChange} />
        </InputGroup>

        {/* 📍 장소 검색 결과 리스트 */}
        <VStack align="stretch" gap={2}>
          {placeList.map(place => (
            <HStack key={place.id} p={2} borderWidth={1} borderRadius="md">
              <Checkbox.Root checked={place.checked}>
                <Checkbox.HiddenInput />
                <Checkbox.Control onClick={() => handleTogglePlace(place.id)} />
              </Checkbox.Root>
              <PlaceCard
                name={place.name}
                activityType={place.type}
                icon={place.icon}
                rating={place.rating}
                total_reviews={place.total_reviews}
                photo_reference={place.photo_reference}
              />
            </HStack>
          ))}
          <Button colorScheme="blue" onClick={handleAddPlaces}>
            선택한 장소 추가
          </Button>
        </VStack>

        {/* 📌 선택된 장소 리스트 */}
        <VStack align="stretch" gap={2}>
          <Text fontSize="lg" fontWeight="bold">
            선택한 장소
          </Text>
          <List.Root gap={2}>
            {selectedPlaces.map(place => (
              <List.Item
                key={place.id}
                p={2}
                borderWidth={1}
                borderRadius="md"
                display="flex"
                justifyContent="space-between"
                alignItems="center">
                <Text>{place.name}</Text>
                <Button size="sm" colorScheme="red" onClick={() => handleRemovePlace(place.id)}>
                  <Icon as={FaTrashAlt} />
                </Button>
              </List.Item>
            ))}
          </List.Root>
        </VStack>
      </VStack>
    </Box>
  );
}
