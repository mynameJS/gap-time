'use client';

import { Box, Text, Heading, Flex, Image, Badge, VStack, Icon, Spinner, Stack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import usePlanStore from '@/store/usePlanInfoStore';
import useSelectedPlanStore from '@/store/useSelectedPlanStore';
import useGeocodeListStore from '@/store/useGeocodeListStore';
import usePolylineListStore from '@/store/usePolylineListStore';
import { FiMapPin } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { PlanWithSchedule, ScheduleBlock } from '@/types/interface';
import { getUserPlansWithSchedule } from '@/lib/api/firebase/plan';
import { PLACES_CATEGORY_COLOR_SET } from '@/constants/place';

interface MyPlanListProps {
  userId: string;
}

function MyPlanList({ userId }: MyPlanListProps) {
  const {
    data: plans,
    isLoading,
    isError,
  } = useQuery<PlanWithSchedule[]>({
    queryKey: ['userPlans', userId],
    queryFn: () => getUserPlansWithSchedule(userId),
  });

  const { setPlanInfo } = usePlanStore();
  const { setSelectedPlan, clearSelectedPlan } = useSelectedPlanStore();
  const { clearGeocodeList } = useGeocodeListStore();
  const { clearPolylineList } = usePolylineListStore();

  const router = useRouter();
  const pathname = usePathname();

  const handleCardClick = (plan: ScheduleBlock[]) => {
    setSelectedPlan(plan);

    const firstPlan = plan[0];

    if (firstPlan?.travel?.origin) {
      setPlanInfo({
        geocode: firstPlan.travel.origin,
        formattedAddress: '',
        routeType: '',
        startTime: [plan[0].start],
        endTime: [plan.at(-1)?.end ?? plan[0].end],
      });
    }
    router.push('/plan?mode=result');
  };

  // ✅ 새로 입장 시 planInfo 초기화
  useEffect(() => {
    setPlanInfo(null);
  }, [setPlanInfo]);

  // ✅ 브라우저 뒤로가기로 마이페이지 재진입 시 selectedPlan 초기화
  useEffect(() => {
    if (pathname === '/mypage') {
      console.log('mypage');
      clearSelectedPlan();
      clearGeocodeList();
      clearPolylineList();
    }
  }, [pathname, clearSelectedPlan, clearGeocodeList, clearPolylineList]);

  return (
    <Box mt="8">
      <Heading size="lg" fontWeight="semibold" color="teal.600" mb="6">
        내가 만든 일정
      </Heading>

      {isLoading ? (
        <Flex justify="center" py="10">
          <Spinner color="teal.500" />
        </Flex>
      ) : isError ? (
        <Text color="red.500">일정 불러오기 중 오류가 발생했습니다.</Text>
      ) : !plans || plans.length === 0 ? (
        <Text color="gray.400" fontSize="sm">
          저장된 일정이 없습니다.
        </Text>
      ) : (
        <VStack gap="6" align="stretch">
          {plans.map((plan, index) => {
            const place = plan.schedule[1]?.placeDetails;
            const rawType = place?.type ?? 'unknown';
            const categoryInfo =
              rawType in PLACES_CATEGORY_COLOR_SET
                ? PLACES_CATEGORY_COLOR_SET[rawType as keyof typeof PLACES_CATEGORY_COLOR_SET]
                : { ko: '기타', color: 'gray' };

            return (
              <Stack
                key={index}
                direction={{ base: 'column', md: 'row' }}
                gap="5"
                p="4"
                border="1px solid"
                borderColor="gray.100"
                borderRadius="2xl"
                bg="white"
                boxShadow="xs"
                _hover={{ boxShadow: 'md' }}
                transition="all 0.2s"
                onClick={() => handleCardClick(plan.schedule)}
                cursor="pointer">
                <Image
                  src={place?.photo_url || place?.icon[0]}
                  alt="대표 이미지"
                  w={{ base: '100%', md: '160px' }}
                  h={{ base: '300px', md: '160px' }}
                  borderRadius="xl"
                  objectFit="cover"
                />
                <VStack align="start" gap="1" flex="1" w="full" justify="center">
                  <Flex align="center" gap="2">
                    <Badge variant="subtle" colorScheme={categoryInfo.color}>
                      {categoryInfo.ko}
                    </Badge>
                    <Text fontWeight="semibold" fontSize="lg" color="gray.700">
                      {place?.name || '일정 제목 없음'}
                    </Text>
                  </Flex>
                  <Text fontSize="sm" color="gray.500">
                    {plan.schedule[0]?.start || '시작 시간 없음'} ~ {plan.schedule.at(-1)?.end || '종료 시간 없음'}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    장소 {plan.schedule.length}개 선택
                  </Text>
                  <Flex align="center" gap="1" flexWrap="wrap">
                    <Icon as={FiMapPin} color="teal.500" boxSize="4" />
                    <Text fontSize="sm" color="gray.500">
                      생성위치 : {place?.address || '위치 정보 없음'}
                    </Text>
                  </Flex>
                </VStack>
                <Text
                  fontSize="xs"
                  color="gray.400"
                  whiteSpace="nowrap"
                  alignSelf="flex-start"
                  display={{ base: 'none', md: 'block' }}>
                  생성일 {new Date(plan.createdAt).toLocaleDateString()}
                </Text>
              </Stack>
            );
          })}
        </VStack>
      )}
    </Box>
  );
}

export default MyPlanList;
