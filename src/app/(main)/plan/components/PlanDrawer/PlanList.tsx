'use client';

import { Flex, Box, Image } from '@chakra-ui/react';
import usePlanStore from '@/store/usePlanInfoStore';
import generateSchedule from '@/utils/generateSchedule';
import calculateTravelTimes from '@/utils/calculateTravelTimes';
import { ScheduleBlock } from '@/types/interface';
import { useState, useEffect } from 'react';

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

  if (!planList) return null;

  return (
    <Flex w="100%">
      <Box>
        {planList.map((block, index) => {
          if (block.activityType === 'move') {
            return (
              <Box key={index}>
                {block.start} ~ {block.end}
                <Box>{block.activityType}</Box>
                <Box>{block.travel?.distance}</Box>
                <Box>{block.travel?.duration}</Box>
              </Box>
            );
          }

          const placeDetails = block.placeDetails;
          const imageUrl = `/api/google-maps/photo?photo_reference=${placeDetails?.photoReference}`;

          return (
            <Box key={index}>
              <Box>
                {block.start} ~ {block.end}
              </Box>
              <Box>{block.activityType}</Box>
              <Box>{placeDetails?.name}</Box>
              <Box>{placeDetails?.address}</Box>
              <Box>별점 : {placeDetails?.rating}</Box>
              <Box>리뷰수 : {placeDetails?.total_reviews}</Box>
              <Image src={imageUrl} alt="사진" />
              <Box>홈페이지 : {placeDetails?.url}</Box>
            </Box>
          );
        })}
      </Box>
    </Flex>
  );
}

export default PlanList;
