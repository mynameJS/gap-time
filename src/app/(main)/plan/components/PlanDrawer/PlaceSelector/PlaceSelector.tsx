'use client';

import { useState, useEffect } from 'react';
import { VStack, HStack, Input, Button, Text, Icon, List, Image, Badge } from '@chakra-ui/react';
import { InputGroup } from '@/components/ui/input-group';
import { FaCheck, FaPlus, FaTrashAlt, FaSearch, FaSyncAlt, FaClock, FaRoute } from 'react-icons/fa';
import { FaMapLocationDot, FaLocationDot } from 'react-icons/fa6';
import usePlanStore from '@/store/usePlanInfoStore';
import useGeocodeListStore from '@/store/useGeocodeListStore';
import getCurrentLocationAddress from '@/utils/getCurrentLocationAddress';
import { PLACES_CATEGORY, DEFAULT_PLACES_CATEGORY } from '@/constants/place';
import PlaceDetailModal from './PlaceDetailModal';
import { TargetedPlaceData } from '@/types/interface';
import getTimeBlocks from '@/utils/getTimeBlocks';
import getDurationFromTimeString from '@/utils/getDurationFromTimeString';
import { fetchNearbyPlacesDetail } from '@/lib/api/places';

function PlaceSelector() {
  const [searchTerm, setSearchTerm] = useState('');
  const [placeList, setPlaceList] = useState<TargetedPlaceData[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<TargetedPlaceData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(DEFAULT_PLACES_CATEGORY);
  const [currentDetailData, setCurrentDetailData] = useState<TargetedPlaceData>();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const { planInfo, updatePlanInfo } = usePlanStore();
  const { addGeocode, removeGeocodeById } = useGeocodeListStore();

  const count = planInfo ? getTimeBlocks(planInfo?.startTime[0], planInfo?.endTime[0]).length : 0;

  // 🔍 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 📍 장소 선택 핸들러 (추가/제거)
  const handleTogglePlace = (place: TargetedPlaceData) => {
    const isSelected = selectedPlaces.some(p => p.place_id === place.place_id);

    if (isSelected) {
      setSelectedPlaces(prev => prev.filter(p => p.place_id !== place.place_id));
      removeGeocodeById(place.place_id); // zustand
    } else {
      // 일정 시간 초과 시 경고 로직
      if (selectedPlaces.length === count) {
        return alert('설정된 일정의 시간을 초과할 수 없습니다.');
      }

      setSelectedPlaces(prev => [...prev, place]);
      if (place.geocode) {
        addGeocode({ place_id: place.place_id, geocode: place.geocode }); // zustand
      }
    }
  };

  // ❌ 선택한 장소 삭제
  const handleRemovePlace = (placeId: string) => {
    setSelectedPlaces(prev => prev.filter(place => place.place_id !== placeId));
    removeGeocodeById(placeId); // zustand
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
      const placeList = await fetchNearbyPlacesDetail(fetchPlacesParams);
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

  // 현재 위치 리프레시
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
      // 토스트나 에러 표시 추가 가능
      alert(err.message);
    }
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
        // const placeList = await fetchNearbyPlaces(fetchPlacesParams);
        const placeList = await fetchNearbyPlacesDetail(fetchPlacesParams);
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
      <VStack gap={2} w="50%" h="100%" align="stretch">
        {/* 📍 현재 위치 표시 & 새로고침 버튼 */}
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
                      {place.address}
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
        {/* 📌 우측 선택된 장소 정보 요약 */}
        <HStack w="100%" justify="space-between" p={3} bg="gray.50" borderRadius="md" boxShadow="sm">
          {/* 시작~종료 시간 */}
          <HStack>
            <Icon as={FaClock} color="gray.600" />
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              {getDurationFromTimeString(planInfo?.startTime[0], planInfo?.endTime[0])} 시간
            </Text>
          </HStack>

          {/* 선택 장소 수 */}
          <HStack>
            <Icon as={FaLocationDot} color="red.500" />
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              {selectedPlaces.length} / {count} 장소
            </Text>
          </HStack>

          {/* 이동 수단 */}
          <HStack>
            <Icon as={FaRoute} color="blue.500" />
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              {planInfo?.routeType}
            </Text>
          </HStack>
        </HStack>

        <VStack w="100%" h="95%" align="stretch" gap={2} borderWidth={3}>
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
                  <Image src={place.photo_url ?? place.icon[0]} alt={place.name} boxSize="40px" borderRadius="md" />
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
        <Button>일정 만들기</Button>
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
