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
}

function PlaceSelectionPanel({
  planInfo,
  selectedPlaces,
  setSelectedPlaces,
  setCustomPlaceList,
  removeGeocodeById,
}: Props) {
  const router = useRouter();
  const count = planInfo ? getTimeBlocks(planInfo.startTime[0], planInfo.endTime[0]).length : 0;

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
    <VStack w="50%" h="100%" align="stretch" gap={2} borderWidth={3} p={4}>
      <HStack w="100%" justify="space-between" p={3} bg="gray.50" borderRadius="md" boxShadow="sm">
        <HStack>
          <Icon as={FaClock} color="gray.600" />
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            {getDurationFromTimeString(planInfo?.startTime[0], planInfo?.endTime[0])} 시간
          </Text>
        </HStack>
        <HStack>
          <Icon as={FaLocationDot} color="red.500" />
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            {selectedPlaces.length} / {count} 장소
          </Text>
        </HStack>
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
              <HStack>
                <Badge colorPalette="blue">{index + 1}</Badge>
                <Image src={place.photo_url ?? place.icon[0]} alt={place.name} boxSize="40px" borderRadius="md" />
                <Text>{place.name}</Text>
              </HStack>
              <Button size="sm" colorPalette="red" onClick={() => handleRemovePlace(place.place_id)}>
                <Icon as={FaTrashAlt} />
              </Button>
            </List.Item>
          ))}
        </List.Root>
      </VStack>

      <Button disabled={selectedPlaces.length === 0} onClick={handleUpdateCustomPlaceList}>
        일정 만들기
      </Button>
    </VStack>
  );
}

export default PlaceSelectionPanel;
