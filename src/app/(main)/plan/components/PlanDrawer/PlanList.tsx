'use client';

import { useState, useEffect } from 'react';
import { Box, Text, VStack, HStack, Icon, Badge, Image, Circle } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaStar, FaRoute, FaClock } from 'react-icons/fa';
import PlaceDetailModal from './PlaceDetailModal';
import usePlanStore from '@/store/usePlanInfoStore';
import generateSchedule from '@/utils/plan/generateSchedule';
import calculateTravelTimes from '@/utils/plan/calculateTravelTimes';
import { ScheduleBlock, GeocodeItem, PlaceDetails } from '@/types/interface';
import useCustomPlaceListStore from '@/store/useCustomPlaceListStore';
import useGeocodeListStore from '@/store/useGeocodeListStore';
import usePolylineListStore from '@/store/usePolylineListStore';
import formatDistance from '@/utils/format/formatDistance';
import formatDurationFromSeconds from '@/utils/format/formatDurationFromSeconds';
import { PLACES_CATEGORY_COLOR_SET } from '@/constants/place';

interface PlanListProps {
  currentDetailData: PlaceDetails | undefined | null;
  isDetailModalOpen: boolean;
  setCurrentDetailData: (place: PlaceDetails | null | undefined) => void;
  onToggle: () => void;
}

function PlanList({ currentDetailData, isDetailModalOpen, setCurrentDetailData, onToggle }: PlanListProps) {
  const { planInfo } = usePlanStore();
  const { customPlaceList } = useCustomPlaceListStore();
  const { setGeocodeList } = useGeocodeListStore();
  const { setPolylineList } = usePolylineListStore();
  const [planList, setPlanList] = useState<ScheduleBlock[]>([]);

  useEffect(() => {
    if (!planInfo) return;

    const fetch = async () => {
      try {
        const schedule: ScheduleBlock[] =
          customPlaceList.length > 0
            ? customPlaceList
            : await generateSchedule({
                startTime: planInfo.startTime[0],
                endTime: planInfo.endTime[0],
                latitude: planInfo.geocode.lat,
                longitude: planInfo.geocode.lng,
              });

        const finalResult = await calculateTravelTimes({
          schedule,
          mode: 'TRANSIT',
          routeType: planInfo.routeType,
          currentLocation: planInfo.geocode,
        });

        setPlanList(finalResult);

        const geocodeList: GeocodeItem[] = [];
        const polylineList: string[] = [];

        finalResult.forEach(item => {
          if (item.placeDetails && item.placeId) {
            geocodeList.push({ place_id: item.placeId, geocode: item.placeDetails.geocode });
          } else if (item.travel) {
            polylineList.push(item.travel.polyline);
          }
        });

        setGeocodeList(geocodeList);
        setPolylineList(polylineList);
      } catch (error) {
        console.error('Error generating plan:', error);
      }
    };

    fetch();
  }, [planInfo, customPlaceList, setGeocodeList, setPolylineList]);

  if (!planList.length || !planInfo) return null;

  const renderCurrentLocationCard = (label: string) => (
    <Box p={4} borderRadius="lg" bg="gray.50" borderWidth={1}>
      <HStack align="center" gap={3}>
        <Icon as={FaMapMarkerAlt} color="teal.500" />
        <VStack align="start" gap={1}>
          <Text fontWeight="bold" fontSize="sm" color="teal.700">
            {label}
          </Text>
          <Text fontSize="sm" color="gray.700">
            {planInfo.formattedAddress}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );

  let placeIndex = 1;

  return (
    <Box w={{ base: '100%', md: '600px' }} h="100%" overflow="auto" bg="white" px={{ base: 3, md: 6 }} py={4}>
      <VStack gap={6} align="stretch">
        {/* 현재 위치 (출발지) */}
        {renderCurrentLocationCard('현재 위치 (출발지)')}

        {planList.map((block, index) => {
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
                  {/* ✅ 숫자 원형 아이콘 */}
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

                {/* {place?.url && (
                  <Link
                    href={place.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    fontSize="sm"
                    color="teal.600"
                    fontWeight="semibold"
                    _hover={{ textDecoration: 'underline' }}>
                    구글 상세 보기 <Icon as={FaExternalLinkAlt} ml={1} boxSize={3} />
                  </Link>
                )} */}
              </VStack>
            </Box>
          );
        })}

        {/* 현재 위치 (도착지) */}
        {planInfo.routeType === '왕복' && renderCurrentLocationCard('현재 위치 (도착지)')}
      </VStack>
      {isDetailModalOpen && currentDetailData && (
        <PlaceDetailModal
          currentDetailData={currentDetailData}
          isDetailModalOpen={isDetailModalOpen}
          onToggle={onToggle}
        />
      )}
    </Box>
  );
}

export default PlanList;
