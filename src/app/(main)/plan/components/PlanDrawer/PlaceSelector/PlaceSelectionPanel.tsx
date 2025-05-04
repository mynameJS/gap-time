'use client';

import { VStack, HStack, Text, Icon, Image, Button, Badge } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { FaClock, FaLocationDot, FaRoute, FaGear } from 'react-icons/fa6';
import { PlanInfo, PlaceDetails, ScheduleBlock } from '@/types/interface';
import getDurationFromTimeString from '@/utils/format/getDurationFromTimeString';
import getTimeBlocks from '@/utils/plan/getTimeBlocks';

const PlanInfoModal = dynamic(() => import('@/components/modal/PlanInfoModal/PlanInfoModal'), {
  ssr: false,
  loading: () => null,
});

interface Props {
  planInfo: PlanInfo | null;
  selectedPlaces: PlaceDetails[];
  setSelectedPlaces: Dispatch<SetStateAction<PlaceDetails[]>>;
  setCustomPlaceList: (list: ScheduleBlock[]) => void;
  removeGeocodeById: (placeId: string) => void;
  count: number;
}

function PlaceSelectionPanel({
  planInfo,
  selectedPlaces,
  setSelectedPlaces,
  setCustomPlaceList,
  removeGeocodeById,
  count,
}: Props) {
  const router = useRouter();
  const [planInfoModalOpen, setPlanInfoModalOpen] = useState<boolean>(false);

  const togglePlanInfoModalOpen = () => {
    setPlanInfoModalOpen(prev => !prev);
  };

  const handleRemovePlace = (placeId: string) => {
    setSelectedPlaces(prev => prev.filter(p => p.place_id !== placeId));
    removeGeocodeById(placeId);
  };

  const handleUpdateCustomPlaceList = () => {
    if (!planInfo) return;

    const timeBlocks = getTimeBlocks(planInfo.startTime[0], planInfo.endTime[0]);
    const newCustomPlaceList: ScheduleBlock[] = selectedPlaces.map((place, index) => {
      return {
        activityType: place.type,
        start: timeBlocks[index].start,
        end: timeBlocks[index].end,
        placeId: place.place_id,
        placeDetails: place,
      };
    });

    if (count > selectedPlaces.length) {
      const confirmed = window.confirm(
        '선택한 장소 수가 적어 전체 일정보다 일찍 끝날 수 있습니다. 그래도 계속하시겠습니까?',
      );
      if (!confirmed) return;
    }

    setCustomPlaceList(newCustomPlaceList);
    router.push('/plan?mode=result');
  };

  return (
    <>
      <VStack w={{ base: '100%', md: '50%' }} h="100%" p={3} gap={4} align="stretch" overflow="auto">
        {/* 상단 정보 바 */}
        <HStack wrap="wrap" gap={4} justify="space-between" p={2} borderRadius="md" boxShadow="sm">
          <HStack gap={2} pl={1}>
            <Icon as={FaClock} color="gray.600" />
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              {getDurationFromTimeString(planInfo?.startTime[0], planInfo?.endTime[0])} 시간
            </Text>
          </HStack>
          <HStack gap={2}>
            <Icon as={FaLocationDot} color="red.500" />
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              {selectedPlaces.length} / {count} 장소
            </Text>
          </HStack>
          <HStack gap={2}>
            <Icon as={FaRoute} color="blue.500" />
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              {planInfo?.routeType}
            </Text>
          </HStack>
          <Button
            variant="ghost"
            size="xs"
            color="gray.600"
            _hover={{ bg: 'gray.100' }}
            onClick={togglePlanInfoModalOpen}>
            <Icon as={FaGear} />
          </Button>
        </HStack>

        {/* 장소 리스트 */}
        <VStack gap={3} align="stretch" overflowY="auto" h="100%" flex="1">
          {selectedPlaces.length === 0 ? (
            <VStack py={{ base: '0', md: '20' }} gap={3} align="center" justify="center" color="gray.500">
              <Icon as={FaLocationDot} boxSize={6} />
              <Text fontSize="sm" textAlign="center">
                선택된 장소가 없습니다. <br />
                장소를 먼저 추가해 주세요!
              </Text>
            </VStack>
          ) : (
            selectedPlaces.map((place, index) => (
              <HStack
                key={place.place_id}
                p={3}
                bg="white"
                borderRadius="md"
                boxShadow="sm"
                justify="space-between"
                align="center">
                <HStack gap={3} minW={0} overflow="hidden">
                  <Badge colorPalette="blue" flexShrink={0}>
                    {index + 1}
                  </Badge>
                  <Image
                    src={place.photo_url ?? place.icon[0]}
                    alt={place.name}
                    boxSize="40px"
                    borderRadius="md"
                    objectFit="cover"
                    flexShrink={0}
                  />
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.800"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    maxW="120px">
                    {place.name}
                  </Text>
                </HStack>

                <Button size="sm" onClick={() => handleRemovePlace(place.place_id)} flexShrink={0}>
                  <Icon as={FaTrashAlt} />
                </Button>
              </HStack>
            ))
          )}
        </VStack>

        {/* 하단 버튼 */}
        <Button
          w="100%"
          size="md"
          colorPalette="teal"
          onClick={handleUpdateCustomPlaceList}
          disabled={selectedPlaces.length === 0}>
          일정 만들기
        </Button>
      </VStack>

      {/* ✅ PlanInfoModal은 dynamic import로 렌더링 */}
      <PlanInfoModal isOpen={planInfoModalOpen} onToggle={togglePlanInfoModalOpen} />
    </>
  );
}

export default PlaceSelectionPanel;
