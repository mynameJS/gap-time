'use client';

import { VStack, HStack, Input, Button, Text, Icon, Image, Badge, Spinner, Box } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaCheck, FaPlus, FaSearch } from 'react-icons/fa';
import { InputGroup } from '@/components/ui/input-group';
import { PRIMARY_PLACES_CATEGORY, DEFAULT_PLACES_CATEGORY, PLACES_CATEGORY_COLOR_SET } from '@/constants/place';
import { fetchNearbyPlacesDetail } from '@/lib/api/google/places';
import useGeocodeListStore from '@/store/useGeocodeListStore';
import usePolylineListStore from '@/store/usePolylineListStore';
import useSelectedPlanStore from '@/store/useSelectedPlanStore';
import { PlaceDetails, PlanInfo } from '@/types/interface';

interface PlaceSearchPanelProps {
  planInfo: PlanInfo | null;
  selectedPlaces: PlaceDetails[];
  handleTogglePlace: (place: PlaceDetails) => void;
  setCurrentDetailData: (place: PlaceDetails) => void;
  onToggle: () => void;
}

function PlaceSearchPanel({
  planInfo,
  selectedPlaces,
  handleTogglePlace,
  setCurrentDetailData,
  onToggle,
}: PlaceSearchPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(DEFAULT_PLACES_CATEGORY);
  const pathname = usePathname();

  const { clearSelectedPlan } = useSelectedPlanStore();
  const { clearGeocodeList } = useGeocodeListStore();
  const { clearPolylineList } = usePolylineListStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const { data: categoryPlaces, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['places', selectedCategory, planInfo?.geocode.lat, planInfo?.geocode.lng],
    queryFn: async () => {
      if (!planInfo) return [];
      return fetchNearbyPlacesDetail({
        latitude: planInfo.geocode.lat,
        longitude: planInfo.geocode.lng,
        type: selectedCategory,
        sortBy: 'distance',
      });
    },
    enabled: !!planInfo,
    staleTime: 1000 * 60 * 10,
  });

  const {
    data: searchResult,
    refetch: searchPlaces,
    isFetching: isSearchLoading,
  } = useQuery({
    queryKey: ['placesSearch', searchTerm],
    queryFn: async () => {
      if (!planInfo || !searchTerm) return [];
      return fetchNearbyPlacesDetail({
        latitude: planInfo.geocode.lat,
        longitude: planInfo.geocode.lng,
        keyword: searchTerm,
      });
    },
    enabled: false,
  });

  const placeList = searchTerm ? (searchResult ?? []) : (categoryPlaces ?? []);

  // ✅ 브라우저 뒤로가기로 /plan/select 재진입 시 selectedPlan 초기화
  useEffect(() => {
    if (pathname === '/plan') {
      clearSelectedPlan();
      clearGeocodeList();
      clearPolylineList();
    }
  }, [pathname, clearSelectedPlan, clearGeocodeList, clearPolylineList]);

  return (
    <VStack
      gap={3}
      w={{ base: '100%', md: '50%' }}
      h={{ base: '20rem', md: '100%' }}
      p={{ base: '1', md: '3' }}
      align="stretch">
      {/* 검색창 */}
      <InputGroup
        borderRadius="md"
        boxShadow="sm"
        endElement={
          <Button variant="ghost" onClick={() => searchPlaces()} minW="auto" p={0} aria-label="검색">
            <Icon as={FaSearch} boxSize={4} />
          </Button>
        }>
        <Input
          placeholder="장소를 검색하세요..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={e => e.key === 'Enter' && searchPlaces()}
        />
      </InputGroup>
      <Text fontSize="smaller" color="blue.600" fontWeight="600" pl={2}>
        현재 위치: {planInfo?.formattedAddress ?? '알 수 없음'}
      </Text>

      {/* 카테고리 */}
      <HStack wrap="wrap">
        {Object.entries(PRIMARY_PLACES_CATEGORY).map(([key, label]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? 'solid' : 'outline'}
            colorPalette="blue"
            size="sm"
            onClick={() => {
              setSelectedCategory(key);
              setSearchTerm('');
            }}>
            {label}
          </Button>
        ))}
      </HStack>

      {/* 장소 리스트 */}
      <VStack align="stretch" p={1} gap={3} overflowY="auto" w="100%" h={{ base: '300px', md: '100%' }}>
        {isCategoryLoading || isSearchLoading ? (
          <VStack py={10} color="teal.600" gap={4}>
            <Spinner size="lg" color="teal.500" />
            <Text fontSize="sm" fontWeight="medium">
              주변 장소를 불러오는 중...
            </Text>
          </VStack>
        ) : placeList.length === 0 ? (
          <VStack py={10} color="gray.500" gap={3}>
            <Text fontSize="md" fontWeight="semibold">
              장소가 없습니다.
            </Text>
            <Text fontSize="sm">다른 키워드나 카테고리를 시도해보세요.</Text>
          </VStack>
        ) : (
          placeList.map(place => {
            const isSelected = selectedPlaces.some(p => p.place_id === place.place_id);
            const categoryInfo = (PLACES_CATEGORY_COLOR_SET as Record<string, { ko: string; color: string }>)?.[
              place.type
            ] ?? {
              ko: place.type,
              color: 'gray',
            };

            return (
              <HStack
                key={place.place_id}
                p={3}
                maxW="30rem"
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
                  <VStack gap={1} align="start" flex="1" minW={0}>
                    {' '}
                    {/* 수정된 부분 */}
                    <HStack gap={1} w="100%" minW={0}>
                      <Badge colorPalette={categoryInfo.color} flexShrink={0} whiteSpace="nowrap">
                        {categoryInfo.ko}
                      </Badge>
                      <Text fontSize="md" fontWeight="semibold" truncate w="100%" minW={0}>
                        {place.name}
                      </Text>
                    </HStack>
                    <Box as="p" fontSize="small" color="gray.600" truncate w="100%" minW={0}>
                      {place.address}
                    </Box>
                    <Text fontSize="sm" color="gray.500">
                      ⭐ {place.rating?.toFixed(1)} ({place.total_reviews?.toLocaleString()} 리뷰)
                    </Text>
                  </VStack>
                </HStack>

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
          })
        )}
      </VStack>
    </VStack>
  );
}

export default PlaceSearchPanel;
