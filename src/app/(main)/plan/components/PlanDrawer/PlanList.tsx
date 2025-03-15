'use client';

import { useState, useEffect } from 'react';
import { Flex, Box, Text, Image, VStack, HStack, Divider, Icon, Link, Avatar } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaExternalLinkAlt, FaStar, FaRoute } from 'react-icons/fa';
import usePlanStore from '@/store/usePlanInfoStore';
import generateSchedule from '@/utils/generateSchedule';
import calculateTravelTimes from '@/utils/calculateTravelTimes';
import { ScheduleBlock } from '@/types/interface';

function PlanList() {
  const { planInfo } = usePlanStore();
  console.log(planInfo);

  const [planList, setPlanList] = useState<ScheduleBlock[]>([]);
  console.log(planList);

  useEffect(() => {
    if (!planInfo) return;

    const fetchPlanList = async () => {
      const scheduleParams = {
        startTime: planInfo.startTime[0],
        endTime: planInfo.endTime[0],
        latitude: planInfo.geocode.lat,
        longitude: planInfo.geocode.lng,
      };

      try {
        const result = await generateSchedule(scheduleParams);

        const finalParams = {
          schedule: result,
          mode: 'transit',
          routeType: '왕복',
          currentLocation: planInfo.geocode,
        };

        const finalResult = await calculateTravelTimes(finalParams);
        setPlanList(finalResult);
      } catch (error) {
        console.error('Error fetching places:', error);
        return null;
      }
    };

    fetchPlanList();
  }, [planInfo]);

  if (!planList.length) return null;

  return (
    <Box w="100%" maxW="600px" mx="auto" p={4} borderWidth={1} borderRadius="lg" boxShadow="md" bg="white">
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
                  <Text fontSize="sm">거리: {block.travel?.distance}</Text>
                  <Text fontSize="sm">소요 시간: {block.travel?.duration}</Text>
                </VStack>
              </HStack>
            );
          }

          const placeDetails = block.placeDetails;
          const imageUrl = placeDetails?.photoReference
            ? `/api/google-maps/photo?photo_reference=${placeDetails.photoReference}`
            : 'https://via.placeholder.com/200';

          return (
            <Box key={index} p={4} borderWidth={1} borderRadius="lg" boxShadow="sm">
              <VStack align="stretch" gap={3}>
                <HStack gap={3}>
                  <Avatar.Root shape="square" size="lg" boxSize="80px">
                    <Avatar.Fallback name="gap-time" />
                    <Avatar.Image src={imageUrl} />
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
                  <Link href={placeDetails.url} fontSize="sm">
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
