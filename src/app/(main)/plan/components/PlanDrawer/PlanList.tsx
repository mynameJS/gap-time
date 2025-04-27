'use client';

import { Box, Text, VStack, HStack, Icon, Spinner, Link, Button, Image, Badge } from '@chakra-ui/react';
import { Timeline } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaMapMarkerAlt, FaRoute, FaStar, FaClock, FaExternalLinkAlt } from 'react-icons/fa';
import { PLACES_CATEGORY_COLOR_SET } from '@/constants/place';
import { addPlanToUser } from '@/lib/api/firebase/plan';
import useCustomPlaceListStore from '@/store/useCustomPlaceListStore';
import useGeocodeListStore from '@/store/useGeocodeListStore';
import usePlanStore from '@/store/usePlanInfoStore';
import usePolylineListStore from '@/store/usePolylineListStore';
import useSelectedPlanStore from '@/store/useSelectedPlanStore';
import { ScheduleBlock, GeocodeItem, PlaceDetails } from '@/types/interface';
import formatDistance from '@/utils/format/formatDistance';
import formatDurationFromSeconds from '@/utils/format/formatDurationFromSeconds';
import getGoogleMapsDirectionUrl from '@/utils/location/getGoogleMapsDirectionUrl';
import calculateTravelTimes from '@/utils/plan/calculateTravelTimes';
import generateSchedule from '@/utils/plan/generateSchedule';

const PlaceDetailModal = dynamic(() => import('./PlaceDetailModal'), { ssr: false, loading: () => null });

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
  const [hasSaved, setHasSaved] = useState(false);

  const { data: planList, isLoading } = useQuery<ScheduleBlock[]>({
    queryKey: ['planList', planInfo, customPlaceList],
    enabled: !!planInfo && !selectedPlan,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!planInfo) throw new Error('planInfo가 없습니다.');

      const schedule =
        customPlaceList.length > 0
          ? customPlaceList
          : await generateSchedule({
              startTime: planInfo.startTime[0],
              endTime: planInfo.endTime[0],
              latitude: planInfo.geocode.lat,
              longitude: planInfo.geocode.lng,
            });

      const result = await calculateTravelTimes({
        schedule,
        mode: 'TRANSIT',
        routeType: planInfo.routeType,
        currentLocation: planInfo.geocode,
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
  const onlyPlaceBlocks = finalPlanList?.filter(block => block.activityType !== 'move') || [];

  const handlePlanSave = async () => {
    const userData = sessionStorage.getItem('user');
    const uid = userData ? JSON.parse(userData).uid : null;

    if (!uid) {
      sessionStorage.setItem('savePending', 'true');
      router.push('/login?redirect=/plan?mode=result');
      return;
    }

    if (finalPlanList && planInfo) {
      await addPlanToUser(uid, finalPlanList, planInfo.formattedAddress, planInfo.routeType);
      const result = confirm('일정이 저장되었습니다. 마이페이지로 이동하시겠습니까?');
      if (result) router.replace('/mypage');
    }
  };

  useEffect(() => {
    const pending = sessionStorage.getItem('savePending');
    const userData = sessionStorage.getItem('user');
    const uid = userData ? JSON.parse(userData).uid : null;

    if (pending && uid && finalPlanList && !hasSaved) {
      sessionStorage.removeItem('savePending');
      setHasSaved(true);

      const saveAfterLogin = async () => {
        if (!planInfo) return;
        await addPlanToUser(uid, finalPlanList, planInfo.formattedAddress, planInfo.routeType);
        const result = confirm('일정이 저장되었습니다. 마이페이지로 이동하시겠습니까?');
        if (result) router.replace('/mypage');
      };

      saveAfterLogin();
    }
  }, [finalPlanList, hasSaved, router, planInfo]);

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

  return (
    <Box w={{ base: '100%', md: '600px' }} h="100%" overflowY="auto" bg="white" p={4}>
      <Timeline.Root>
        <Timeline.Item>
          <Timeline.Separator />
          <Timeline.Indicator>
            <FaMapMarkerAlt />
          </Timeline.Indicator>
          <Timeline.Content>
            <Box p={3} borderWidth={1} borderColor="gray.200" borderRadius="lg" bg="gray.50">
              <Timeline.Title>현재 위치 (출발지)</Timeline.Title>
              <Timeline.Description>{planInfo?.formattedAddress}</Timeline.Description>
            </Box>
          </Timeline.Content>
        </Timeline.Item>

        {finalPlanList.map((block, index) => {
          if (block.activityType === 'move') {
            return (
              <Timeline.Item key={`move-${index}`}>
                <Timeline.Separator />
                <Timeline.Indicator>
                  <FaRoute />
                </Timeline.Indicator>
                <Timeline.Content>
                  <Timeline.Title>
                    이동 ({block.start} ~ {block.end})
                  </Timeline.Title>
                  <Timeline.Description>
                    거리 {formatDistance(block.travel?.distance)}, 시간{' '}
                    {formatDurationFromSeconds(block.travel?.duration)}
                    {block.travel?.origin && block.travel?.destination && (
                      <Link
                        href={getGoogleMapsDirectionUrl(block.travel.origin, block.travel.destination)}
                        target="_blank"
                        rel="noopener noreferrer"
                        ml={2}
                        color="blue.500">
                        <Icon as={FaExternalLinkAlt} boxSize={3} /> 길찾기
                      </Link>
                    )}
                  </Timeline.Description>
                </Timeline.Content>
              </Timeline.Item>
            );
          }

          const placeIndex = onlyPlaceBlocks.findIndex(b => b === block);

          return (
            <Timeline.Item
              key={`place-${index}`}
              onClick={() => {
                setCurrentDetailData(block.placeDetails);
                onToggle();
              }}
              cursor="pointer">
              <Timeline.Separator />
              <Timeline.Indicator bg="teal.500" color="white" w="24px" h="24px" fontSize="xs" fontWeight="bold">
                {placeIndex + 1}
              </Timeline.Indicator>
              <Timeline.Content>
                <Box p={3} borderWidth={1} borderRadius="lg" bg="white" _hover={{ bg: 'gray.50' }}>
                  <HStack align="start" gap={4}>
                    <Image
                      src={block.placeDetails?.photo_url ?? block.placeDetails?.icon[0]}
                      alt={block.placeDetails?.name}
                      boxSize="100px"
                      borderRadius="md"
                      objectFit="cover"
                      flexShrink={0}
                    />
                    <VStack align="start" gap={1} flex="1" overflow="hidden">
                      {(() => {
                        const categoryInfo = PLACES_CATEGORY_COLOR_SET[
                          (block.placeDetails?.type ?? 'unknown') as keyof typeof PLACES_CATEGORY_COLOR_SET
                        ] ?? { ko: '기타', color: 'gray' };

                        return (
                          <>
                            <HStack gap={2} w="100%" overflow="hidden">
                              <Badge colorPalette={categoryInfo.color}>{categoryInfo.ko}</Badge>
                              <Text fontWeight="bold" fontSize="md" maxW="100%" truncate>
                                {block.placeDetails?.name}
                              </Text>
                            </HStack>

                            <Text fontSize="sm" color="gray.600" maxW="100%" truncate>
                              {block.placeDetails?.address}
                            </Text>

                            <HStack gap={1}>
                              <Icon as={FaStar} color="yellow.400" />
                              <Text fontSize="sm">
                                {block.placeDetails?.rating?.toFixed(1)} (
                                {block.placeDetails?.total_reviews?.toLocaleString()} 리뷰)
                              </Text>
                            </HStack>

                            <HStack gap={1}>
                              <Icon as={FaClock} color="teal.500" />
                              <Text fontSize="sm">
                                {block.start} ~ {block.end}
                              </Text>
                            </HStack>
                          </>
                        );
                      })()}
                    </VStack>
                  </HStack>
                </Box>
              </Timeline.Content>
            </Timeline.Item>
          );
        })}

        {planInfo?.routeType === '왕복' && (
          <Timeline.Item>
            <Timeline.Separator />
            <Timeline.Indicator>
              <FaMapMarkerAlt />
            </Timeline.Indicator>
            <Timeline.Content>
              <Box p={3} borderWidth={1} borderColor="gray.200" borderRadius="lg" bg="gray.50">
                <Timeline.Title>현재 위치 (도착지)</Timeline.Title>
                <Timeline.Description>{planInfo?.formattedAddress}</Timeline.Description>
              </Box>
            </Timeline.Content>
          </Timeline.Item>
        )}
      </Timeline.Root>

      {isDetailModalOpen && currentDetailData && (
        <PlaceDetailModal
          currentDetailData={currentDetailData}
          isDetailModalOpen={isDetailModalOpen}
          onToggle={onToggle}
        />
      )}

      {!selectedPlan && (
        <Box textAlign="right">
          <Button colorPalette="teal" onClick={handlePlanSave}>
            일정 저장하기
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default PlanList;
