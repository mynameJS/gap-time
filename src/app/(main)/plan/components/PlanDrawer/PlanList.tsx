'use client';

import { useState, useEffect } from 'react';
import { Box, Text, VStack, HStack, Icon, Link, Avatar } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaExternalLinkAlt, FaStar, FaRoute, FaTag } from 'react-icons/fa';
import usePlanStore from '@/store/usePlanInfoStore';
import generateSchedule from '@/utils/plan/generateSchedule';
import calculateTravelTimes from '@/utils/plan/calculateTravelTimes';
import { ScheduleBlock } from '@/types/interface';
import useCustomPlaceListStore from '@/store/useCustomPlaceListStore';
import formatDistance from '@/utils/format/formatDistance';
import formatDurationFromSeconds from '@/utils/format/formatDurationFromSeconds';
import useGeocodeListStore from '@/store/useGeocodeListStore';
import usePolylineListStore from '@/store/usePolylineListStore';
import { GeocodeItem } from '@/types/interface';

function PlanList() {
  const { planInfo } = usePlanStore();
  const { customPlaceList } = useCustomPlaceListStore();
  const { setGeocodeList } = useGeocodeListStore();
  const { setPolylineList } = usePolylineListStore();
  const [planList, setPlanList] = useState<ScheduleBlock[]>([]);

  useEffect(() => {
    if (!planInfo) return;

    const fetch = async () => {
      try {
        let schedule: ScheduleBlock[];

        if (customPlaceList.length > 0) {
          // ✅ 사용자가 직접 선택한 커스텀 일정이 있는 경우
          schedule = customPlaceList;
        } else {
          // ✅ 커스텀 없으면 추천 일정 생성
          const scheduleParams = {
            startTime: planInfo.startTime[0],
            endTime: planInfo.endTime[0],
            latitude: planInfo.geocode.lat,
            longitude: planInfo.geocode.lng,
          };

          schedule = await generateSchedule(scheduleParams);
        }

        // 공통적으로 calculateTravelTimes 실행
        const finalParams = {
          schedule,
          mode: 'TRANSIT',
          routeType: planInfo.routeType,
          currentLocation: planInfo.geocode,
        };

        const finalResult = await calculateTravelTimes(finalParams);
        setPlanList(finalResult);

        // 마커 표시용 geocodeList 와 경료 표시용 list 업데이트
        const geocodeList: GeocodeItem[] = [];
        const polylineList: string[] = [];
        finalResult.forEach(item => {
          if (item.placeDetails && item.placeId) {
            const geocodeItem: GeocodeItem = {
              place_id: item.placeId,
              geocode: item.placeDetails.geocode,
            };
            geocodeList.push(geocodeItem);
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

  if (!planList.length) return null;

  return (
    <Box
      w="100%"
      h="100vh"
      maxW="600px"
      mx="auto"
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      overflow="auto">
      <VStack gap={6} align="stretch">
        {planList.map((block, index) => {
          if (block.activityType === 'move') {
            return (
              <HStack key={index} gap={4} p={4} bg="gray.50" borderRadius="md">
                <Icon as={FaRoute} color="blue.500" />
                <VStack align="start" gap={1}>
                  <Text fontSize="sm" fontWeight="bold" color="blue.600">
                    이동 ({block.start} ~ {block.end})
                  </Text>
                  <Text fontSize="sm">거리: {formatDistance(block.travel?.distance)}</Text>
                  <Text fontSize="sm">소요 시간: {formatDurationFromSeconds(block.travel?.duration)}</Text>
                </VStack>
              </HStack>
            );
          }

          const placeDetails = block.placeDetails;
          const imageUrl = placeDetails?.photo_url ?? (placeDetails?.icon[0] || null); // ✅ 사진이 없으면 아이콘, 아이콘도 없으면 null
          {
          }
          return (
            <Box key={index} p={4} borderWidth={1} borderRadius="lg" boxShadow="sm">
              <VStack align="stretch" gap={3}>
                {/* 활동 유형 추가 */}
                <HStack>
                  <Icon as={FaTag} color="purple.500" />
                  <Text fontSize="sm" fontWeight="bold" color="purple.600">
                    {block.activityType.toUpperCase()}
                  </Text>
                </HStack>

                <HStack gap={3}>
                  {/* 대표 이미지 (사진 > 아이콘 > fallback) */}
                  <Avatar.Root shape="square" size="lg" boxSize="80px">
                    <Avatar.Fallback name="gap-time" />
                    {imageUrl ? <Avatar.Image src={imageUrl} /> : null}
                  </Avatar.Root>

                  <VStack align="start" gap={1}>
                    <Text fontSize="md" fontWeight="bold">
                      {placeDetails?.name || '장소 정보 없음'}
                    </Text>
                    <HStack>
                      <Icon as={FaMapMarkerAlt} color="red.400" />
                      <Text fontSize="sm">{placeDetails?.address || '주소 정보 없음'}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaStar} color="yellow.400" />
                      <Text fontSize="sm">
                        {placeDetails?.rating || 'N/A'} ({placeDetails?.total_reviews || 0} 리뷰)
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>

                <Text fontSize="sm" color="gray.500">
                  {block.start} ~ {block.end}
                </Text>

                {placeDetails?.url && (
                  <Link as="a" href={placeDetails.url} fontSize="sm" target="_blank" rel="noopener noreferrer">
                    자세히 보기 <Icon as={FaExternalLinkAlt} mx="1" />
                  </Link>
                )}
              </VStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}

export default PlanList;
