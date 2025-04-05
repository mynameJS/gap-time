'use client';

import { Box, Text, VStack, HStack, Icon, Badge, Image, Circle, Link, Button, Spinner } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaStar, FaRoute, FaClock, FaExternalLinkAlt } from 'react-icons/fa';
import PlaceDetailModal from './PlaceDetailModal';
import usePlanStore from '@/store/usePlanInfoStore';
import useSelectedPlanStore from '@/store/useSelectedPlanStore';
import calculateTravelTimes from '@/utils/plan/calculateTravelTimes';
import { ScheduleBlock, GeocodeItem, PlaceDetails } from '@/types/interface';
import useCustomPlaceListStore from '@/store/useCustomPlaceListStore';
import useGeocodeListStore from '@/store/useGeocodeListStore';
import usePolylineListStore from '@/store/usePolylineListStore';
import formatDistance from '@/utils/format/formatDistance';
import formatDurationFromSeconds from '@/utils/format/formatDurationFromSeconds';
import { PLACES_CATEGORY_COLOR_SET } from '@/constants/place';
import { useQuery } from '@tanstack/react-query';
import generateSchedule from '@/utils/plan/generateSchedule';
import getGoogleMapsDirectionUrl from '@/utils/location/getGoogleMapsDirectionUrl';
import { addPlanToUser } from '@/lib/api/firebase/plan';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

interface PlanListProps {
  currentDetailData: PlaceDetails | undefined | null;
  isDetailModalOpen: boolean;
  setCurrentDetailData: (place: PlaceDetails | null | undefined) => void;
  onToggle: () => void;
}

function PlanList({ currentDetailData, isDetailModalOpen, setCurrentDetailData, onToggle }: PlanListProps) {
  const { planInfo } = usePlanStore();
  const { customPlaceList } = useCustomPlaceListStore();
  const { selectedPlan } = useSelectedPlanStore();
  const { setGeocodeList } = useGeocodeListStore();
  const { setPolylineList } = usePolylineListStore();
  const router = useRouter();

  const { data: planList, isLoading } = useQuery<ScheduleBlock[]>({
    queryKey: ['planList', planInfo, customPlaceList],
    enabled: !!planInfo && !selectedPlan,
    queryFn: async () => {
      const schedule: ScheduleBlock[] =
        customPlaceList.length > 0
          ? customPlaceList
          : await generateSchedule({
              startTime: planInfo!.startTime[0],
              endTime: planInfo!.endTime[0],
              latitude: planInfo!.geocode.lat,
              longitude: planInfo!.geocode.lng,
            });

      const result = await calculateTravelTimes({
        schedule,
        mode: 'TRANSIT',
        routeType: planInfo!.routeType,
        currentLocation: planInfo!.geocode,
      });

      const geocodeList: GeocodeItem[] = [];
      const polylineList: string[] = [];

      result.forEach(item => {
        if (item.placeDetails && item.placeId) {
          geocodeList.push({ place_id: item.placeId, geocode: item.placeDetails.geocode });
        } else if (item.travel) {
          polylineList.push(item.travel.polyline);
        }
      });

      setGeocodeList(geocodeList);
      setPolylineList(polylineList);

      return result;
    },
  });

  const finalPlanList = useMemo(() => selectedPlan || planList, [selectedPlan, planList]);

  useEffect(() => {
    if (selectedPlan) {
      const geocodeList: GeocodeItem[] = [];
      const polylineList: string[] = [];

      selectedPlan.forEach(item => {
        if (item.placeDetails && item.placeId) {
          geocodeList.push({ place_id: item.placeId, geocode: item.placeDetails.geocode });
        } else if (item.travel) {
          polylineList.push(item.travel.polyline);
        }
      });

      setGeocodeList(geocodeList);
      setPolylineList(polylineList);
    }
  }, [selectedPlan, setGeocodeList, setPolylineList]);

  const handlePlanSave = async () => {
    const userData = sessionStorage.getItem('user');
    const uid = JSON.parse(userData!).uid;
    if (finalPlanList) {
      await addPlanToUser(uid, finalPlanList);
      const result = confirm('일정이 저장되었습니다. 마이페이지로 이동하시겠습니까?');
      if (result) {
        router.replace('/mypage');
      }
    }
  };

  if (!planInfo && !selectedPlan) return null;

  if (isLoading) {
    return (
      <Box
        w={{ base: '100%', md: '600px' }}
        h="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg="white"
        px={4}>
        <VStack gap={4} align="center">
          <Spinner size="xl" color="teal.500" />
          <Text fontSize="sm" color="gray.500">
            일정을 생성 중입니다...
          </Text>
        </VStack>
      </Box>
    );
  }
  if (!finalPlanList || finalPlanList.length === 0) {
    return (
      <Box w={{ base: '100%', md: '600px' }} h="100%" display="flex" justifyContent="center" alignItems="center">
        <Text color="gray.500" fontSize="sm">
          불러올 수 있는 일정이 없습니다.
        </Text>
      </Box>
    );
  }

  const renderCurrentLocationCard = (label: string) => (
    <Box p={4} borderRadius="lg" bg="gray.50" borderWidth={1}>
      <HStack align="center" gap={3}>
        <Icon as={FaMapMarkerAlt} color="teal.500" />
        <VStack align="start" gap={1}>
          <Text fontWeight="bold" fontSize="sm" color="teal.700">
            {label}
          </Text>
          <Text fontSize="sm" color="gray.700">
            {planInfo?.formattedAddress || '주소 정보 없음'}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );

  let placeIndex = 1;

  return (
    <Box w={{ base: '100%', md: '600px' }} h="100%" overflow="auto" bg="white" px={{ base: 3, md: 6 }} py={4}>
      <VStack gap={6} align="stretch">
        {renderCurrentLocationCard('현재 위치 (출발지)')}

        {finalPlanList.map((block, index) => {
          if (block.activityType === 'move') {
            return (
              <HStack key={index} p={4} bg="gray.50" borderRadius="lg" align="flex-start">
                <Icon as={FaRoute} color="blue.500" boxSize={5} />
                <VStack align="start" gap={1}>
                  <Text fontWeight="bold" fontSize="sm" color="blue.600">
                    이동 ({block.start} ~ {block.end})
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    거리: {formatDistance(block.travel?.distance)}
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    소요 시간: {formatDurationFromSeconds(block.travel?.duration)}
                  </Text>
                  {block.travel?.origin && block.travel?.destination && (
                    <Link
                      href={getGoogleMapsDirectionUrl(block.travel.origin, block.travel.destination)}
                      target="_blank"
                      rel="noopener noreferrer"
                      display="inline-flex"
                      alignItems="center"
                      fontSize="sm"
                      color="blue.500"
                      fontWeight="medium"
                      _hover={{ textDecoration: 'underline', color: 'blue.600' }}
                      gap={1}
                      pt={1}>
                      <Icon as={FaExternalLinkAlt} boxSize={3.5} />
                      길찾기
                    </Link>
                  )}
                </VStack>
              </HStack>
            );
          }

          const place = block?.placeDetails;
          const rawType = place?.type ?? 'unknown';
          const categoryInfo =
            rawType in PLACES_CATEGORY_COLOR_SET
              ? PLACES_CATEGORY_COLOR_SET[rawType as keyof typeof PLACES_CATEGORY_COLOR_SET]
              : { ko: '기타', color: 'gray' };

          const currentIndex = placeIndex++;

          return (
            <Box
              key={index}
              p={4}
              borderRadius="xl"
              borderWidth={1}
              boxShadow="sm"
              bg="white"
              onClick={() => {
                setCurrentDetailData(place);
                onToggle();
              }}
              cursor="pointer">
              <VStack align="stretch" gap={4}>
                <HStack gap={2}>
                  <Circle
                    size="24px"
                    bg="gray.700"
                    color="white"
                    fontSize="sm"
                    fontWeight="bold"
                    flexShrink={0}
                    textAlign="center">
                    {currentIndex}
                  </Circle>
                  <Text fontWeight="bold" fontSize="lg">
                    {place?.name || '장소 없음'}
                  </Text>
                </HStack>

                <HStack gap={4} align="start">
                  <Image
                    src={place?.photo_url ?? place?.icon[0]}
                    alt={place?.name}
                    boxSize="80px"
                    borderRadius="md"
                    objectFit="cover"
                    flexShrink={0}
                  />
                  <VStack align="start" gap={1} flex="1">
                    <HStack>
                      <Badge colorPalette={categoryInfo.color} fontSize="xs">
                        {categoryInfo.ko}
                      </Badge>
                    </HStack>
                    <HStack>
                      <Icon as={FaMapMarkerAlt} color="red.400" />
                      <Text fontSize="sm" color="gray.700">
                        {place?.address || '주소 정보 없음'}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaStar} color="yellow.400" />
                      <Text fontSize="sm" color="gray.700">
                        {place?.rating?.toFixed(1) || '-'} ({place?.total_reviews?.toLocaleString() || 0} 리뷰)
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaClock} color="teal.500" />
                      <Text fontSize="sm" color="gray.700">
                        {block.start} ~ {block.end}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
              </VStack>
            </Box>
          );
        })}

        {planInfo?.routeType === '왕복' && renderCurrentLocationCard('현재 위치 (도착지)')}
      </VStack>

      {isDetailModalOpen && currentDetailData && (
        <PlaceDetailModal
          currentDetailData={currentDetailData}
          isDetailModalOpen={isDetailModalOpen}
          onToggle={onToggle}
        />
      )}

      {!selectedPlan && (
        <Box mt={6} textAlign="right">
          <Button colorPalette="teal" onClick={handlePlanSave}>
            일정 저장하기
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default PlanList;
