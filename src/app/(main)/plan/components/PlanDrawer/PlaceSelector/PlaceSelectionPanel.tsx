'use client';

import { VStack, HStack, Text, Icon, Image, Button, Badge, List } from '@chakra-ui/react';
import { FaTrashAlt } from 'react-icons/fa';
import { FaClock, FaLocationDot, FaRoute } from 'react-icons/fa6';
import { PlanInfo, TargetedPlaceData } from '@/types/interface';
import getDurationFromTimeString from '@/utils/format/getDurationFromTimeString';
import getTimeBlocks from '@/utils/plan/getTimeBlocks';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { ScheduleBlock } from '@/types/interface';

interface Props {
  planInfo: PlanInfo | null;
  selectedPlaces: TargetedPlaceData[];
  setSelectedPlaces: Dispatch<SetStateAction<TargetedPlaceData[]>>;
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

  const handleRemovePlace = (placeId: string) => {
    setSelectedPlaces(prev => prev.filter(p => p.place_id !== placeId));
    removeGeocodeById(placeId);
  };

  const handleUpdateCustomPlaceList = () => {
    if (!planInfo) return;

    const timeBlocks = getTimeBlocks(planInfo.startTime[0], planInfo.endTime[0]);
    const newCustomPlaceList: ScheduleBlock[] = selectedPlaces.map((place, index) => {
      const { place_id, ...rest } = place;
      return {
        activityType: place.type,
        start: timeBlocks[index].start,
        end: timeBlocks[index].end,
        placeId: place_id,
        placeDetails: rest,
      };
    });

    if (count > selectedPlaces.length) {
      const confirmed = window.confirm(
        '선택한 장소 수가 적어 전체 일정보다 일찍 끝날 수 있습니다. 그래도 계속하시겠습니까?'
      );
      if (!confirmed) return;
    }

    setCustomPlaceList(newCustomPlaceList);
    router.push('/plan?mode=result');
  };

  return (
    <VStack w={{ base: '100%', md: '50%' }} h="100%" p={2} gap={4} align="stretch" overflow="auto">
      {/* 상단 정보 바 */}
      <HStack wrap="wrap" gap={4} justify="space-between" p={3} borderRadius="md" boxShadow="sm">
        <HStack gap={2}>
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
        size="md"
        colorPalette="teal"
        onClick={handleUpdateCustomPlaceList}
        disabled={selectedPlaces.length === 0}>
        일정 만들기
      </Button>
    </VStack>
  );
}

export default PlaceSelectionPanel;
