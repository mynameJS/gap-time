'use client';

import { useState, useEffect } from 'react';
import { Box, VStack, HStack, Input, Button, Text, Icon, List, Image, Badge, Tabs } from '@chakra-ui/react';
import { InputGroup } from '@/components/ui/input-group';
import { FaCheck, FaPlus, FaTrashAlt, FaSearch } from 'react-icons/fa';
import usePlanStore from '@/store/usePlanInfoStore';
import { fetchNearbyPlaces } from '@/lib/api/places';
import { PLACES_CATEGORY, DEFAULT_PLACES_CATEGORY } from '@/constants/place';
import PlaceDetailModal from './PlaceDetailModal';
import { TargetedPlaceData } from '@/types/interface';

function PlaceSelector() {
  const [searchTerm, setSearchTerm] = useState('');
  const [placeList, setPlaceList] = useState<TargetedPlaceData[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<TargetedPlaceData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(DEFAULT_PLACES_CATEGORY);
  const [currentDetailData, setCurrentDetailData] = useState<TargetedPlaceData>();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const { planInfo } = usePlanStore();

  // 🔍 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 📍 장소 선택 핸들러 (추가/제거)
  const handleTogglePlace = (place: TargetedPlaceData) => {
    setSelectedPlaces(prev => {
      const isSelected = prev.some(p => p.place_id === place.place_id);
      return isSelected ? prev.filter(p => p.place_id !== place.place_id) : [...prev, place];
    });
  };

  // ❌ 선택한 장소 삭제
  const handleRemovePlace = (placeId: string) => {
    setSelectedPlaces(prev => prev.filter(place => place.place_id !== placeId));
  };

  // 장소 키워드 검색
  const handleSearchPlaces = async () => {
    if (!planInfo) return;

    const fetchPlacesParams = {
      latitude: planInfo.geocode.lat,
      longitude: planInfo.geocode.lng,
      sortBy: 'distance',
      keyword: searchTerm,
    };

    try {
      const placeList = await fetchNearbyPlaces(fetchPlacesParams);
      setPlaceList(placeList);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  // 상세보기 모달 온오프 토글
  const toggleModalOpen = () => {
    setIsDetailModalOpen(prev => !prev);
  };

  // 클릭 시 선택된 장소 데이터 저장 (currentDetailData)
  // DetailModal Open
  const handleClickPlaceCard = (place: TargetedPlaceData) => {
    setCurrentDetailData(place);
    toggleModalOpen();
  };

  // 📡 Google Places API에서 장소 가져오기
  useEffect(() => {
    if (!planInfo) return;

    const fetchPlacesParams = {
      latitude: planInfo.geocode.lat,
      longitude: planInfo.geocode.lng,
      // radius: 50000,
      type: selectedCategory,
      sortBy: 'distance',
    };

    const fetchPlaces = async () => {
      try {
        const placeList = await fetchNearbyPlaces(fetchPlacesParams);
        // console.log(placeList);
        setPlaceList(placeList);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };
    fetchPlaces();
  }, [planInfo, selectedCategory]);

  return (
    <HStack w="100%" h="100%" p={4} borderWidth={3} borderRadius="md" boxShadow="sm">
      {/* 좌측 장소 리스트 */}
      <VStack gap={4} w="50%" h="100%" align="stretch">
        {/* 🔍 검색 바 */}
        <VStack>
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
        </VStack>
        <VStack w="100%" align={'start'}>
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
        </VStack>
        {/* 📍 장소 검색 결과 리스트 */}
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
                {/* 장소 정보 */}
                <HStack>
                  {/* 장소 이미지 */}
                  <Image src={place.photo_url ?? place.icon[0]} alt={place.name} boxSize="50px" borderRadius="md" />
                  {/* 텍스트 정보 */}
                  <VStack align="start" gap={1} onClick={() => handleClickPlaceCard(place)} cursor={'pointer'}>
                    <Text fontSize="md" fontWeight="bold">
                      <Badge colorPalette="blue">{place.type}</Badge>
                      {place.name}
                    </Text>
                    <Text fontSize="sm" color="gray.800">
                      {place.vicinity}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      ⭐ {place.rating?.toFixed(1)} ({place.total_reviews?.toLocaleString()} 리뷰)
                    </Text>
                  </VStack>
                </HStack>

                {/* + 또는 체크 버튼 */}
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

      {/* 📌 우측 선택된 장소 리스트 */}
      <VStack w="50%" h="100%" align="stretch" gap={2} borderWidth={3} p={4}>
        <Text fontSize="lg" fontWeight="bold">
          선택한 장소
        </Text>
        <List.Root gap={2} overflow="auto">
          {selectedPlaces.map((place, index) => (
            <List.Item
              key={place.place_id}
              p={2}
              borderWidth={1}
              borderRadius="md"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              w="100%">
              {/* 번호 & 이미지 */}
              <HStack>
                <Badge colorPalette="blue">{index + 1}</Badge>
                <Image
                  src={
                    place.photo_reference
                      ? `/api/google-maps/photo?photo_reference=${place.photo_reference}`
                      : place.icon[0]
                  }
                  alt={place.name}
                  boxSize="40px"
                  borderRadius="md"
                />
                <Text>{place.name}</Text>
              </HStack>
              {/* 삭제 버튼 */}
              <Button size="sm" colorPalette="red" onClick={() => handleRemovePlace(place.place_id)}>
                <Icon as={FaTrashAlt} />
              </Button>
            </List.Item>
          ))}
        </List.Root>
      </VStack>
      {isDetailModalOpen && (
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
