'use client';

import { VStack, HStack, Input, Button, Text, Icon, Image, Badge } from '@chakra-ui/react';
import { InputGroup } from '@/components/ui/input-group';
import { FaCheck, FaPlus, FaSearch } from 'react-icons/fa';
// import { FaMapLocationDot } from 'react-icons/fa6';
import { PlaceDetails, PlanInfo } from '@/types/interface';
import { PRIMARY_PLACES_CATEGORY, DEFAULT_PLACES_CATEGORY, PLACES_CATEGORY_COLOR_SET } from '@/constants/place';
// import getCurrentLocationAddress from '@/utils/location/getCurrentLocationAddress';
import { fetchNearbyPlacesDetail } from '@/lib/api/places';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
// import usePlanStore from '@/store/usePlanInfoStore';

interface PlaceSearchPanelProps {
  planInfo: PlanInfo | null;
  placeList: PlaceDetails[];
  setPlaceList: Dispatch<SetStateAction<PlaceDetails[]>>;
  selectedPlaces: PlaceDetails[];
  handleTogglePlace: (place: PlaceDetails) => void;
  setCurrentDetailData: (place: PlaceDetails) => void;
  onToggle: () => void;
}

function PlaceSearchPanel({
  planInfo,
  placeList,
  setPlaceList,
  selectedPlaces,
  handleTogglePlace,
  setCurrentDetailData,
  onToggle,
}: PlaceSearchPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(DEFAULT_PLACES_CATEGORY);
  // const { updatePlanInfo } = usePlanStore();

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

  // const handleRefreshLocation = async () => {
  //   try {
  //     const { geocode, formattedAddress } = await getCurrentLocationAddress();
  //     updatePlanInfo({
  //       geocode,
  //       formattedAddress,
  //     });
  //     alert('위치 데이터가 업데이트 되었습니다.');
  //   } catch (err: any) {
  //     console.error(err.message);
  //     alert(err.message);
  //   }
  // };

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
    <VStack
      gap={4}
      w={{ base: '100%', md: '50%' }}
      h={{ base: '20rem', md: '100%' }}
      p={{ base: '1', md: '3' }}
      // borderWidth={3}
      align="stretch">
      {/* 현재 위치 */}
      {/* <HStack justify="space-between">
        <HStack>
          <Icon as={FaMapLocationDot} color="teal.500" />
          <Text fontSize="lg" fontWeight="bold" color="gray.700">
            {planInfo?.formattedAddress ?? '위치를 불러오는 중...'}
          </Text>
        </HStack>
        <Button
          onClick={handleRefreshLocation}
          size="xs"
          variant="ghost"
          colorPalette="gray"
          aria-label="위치 새로고침">
          <Icon as={FaSyncAlt} boxSize={3} />
        </Button>
      </HStack> */}

      {/* 검색창 */}
      <InputGroup
        borderRadius="md"
        boxShadow="sm"
        endElement={
          <Button variant="ghost" onClick={handleSearchPlaces} minW="auto" p={0} aria-label="검색">
            <Icon as={FaSearch} boxSize={4} />
          </Button>
        }>
        <Input
          placeholder="장소를 검색하세요..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={e => e.key === 'Enter' && handleSearchPlaces()}
        />
      </InputGroup>

      {/* 카테고리 */}
      <HStack wrap="wrap">
        {Object.entries(PRIMARY_PLACES_CATEGORY).map(([key, label]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? 'solid' : 'outline'}
            colorPalette="blue"
            size="sm"
            onClick={() => setSelectedCategory(key)}>
            {label}
          </Button>
        ))}
      </HStack>

      {/* 장소 리스트 */}
      <VStack align="stretch" p={1} gap={3} overflowY="auto" w="100%" h={{ base: '300px', md: '100%' }}>
        {placeList.map(place => {
          const isSelected = selectedPlaces.some(p => p.place_id === place.place_id);
          return (
            <HStack
              key={place.place_id}
              p={3}
              bg="white"
              borderRadius="md"
              boxShadow="sm"
              justify="space-between"
              align="flex-start"
              gap={4}>
              <HStack
                gap={3}
                align="flex-start"
                flex="1"
                minW={0}
                cursor="pointer"
                onClick={() => {
                  setCurrentDetailData(place);
                  onToggle();
                }}>
                <Image
                  src={place.photo_url ?? place.icon[0]}
                  alt={place.name}
                  boxSize="4.6rem"
                  flexShrink={0}
                  borderRadius="md"
                />
                <VStack gap={1} align="start" w="100%" minW={0}>
                  {/* 장소명 + 타입 */}
                  <HStack gap={1} w="100%" minW={0}>
                    {(() => {
                      const categoryInfo = (
                        PLACES_CATEGORY_COLOR_SET as Record<string, { ko: string; color: string }>
                      )?.[place.type] ?? {
                        ko: place.type,
                        color: 'gray',
                      };
                      return (
                        <>
                          <Badge colorPalette={categoryInfo.color} flexShrink={0} whiteSpace="nowrap">
                            {categoryInfo.ko}
                          </Badge>
                          <Text
                            fontSize="md"
                            fontWeight="semibold"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis">
                            {place.name}
                          </Text>
                        </>
                      );
                    })()}
                  </HStack>

                  {/* 주소 */}
                  <Text
                    fontSize="small"
                    color="gray.600"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    maxW="100%">
                    {place.address}
                  </Text>

                  {/* 평점 */}
                  <Text fontSize="sm" color="gray.500">
                    ⭐ {place.rating?.toFixed(1)} ({place.total_reviews?.toLocaleString()} 리뷰)
                  </Text>
                </VStack>
              </HStack>

              {/* 버튼 */}
              <Button
                size="sm"
                bg={isSelected ? 'green.500' : 'gray.200'}
                onClick={() => handleTogglePlace(place)}
                flexShrink={0}
                minW="36px"
                h="100%">
                <Icon as={isSelected ? FaCheck : FaPlus} color={isSelected ? 'white' : 'gray.400'} />
              </Button>
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
}

export default PlaceSearchPanel;
