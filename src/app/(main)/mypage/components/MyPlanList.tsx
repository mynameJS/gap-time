'use client';

import {
  Box,
  Text,
  Heading,
  Flex,
  Image,
  VStack,
  Icon,
  Spinner,
  Stack,
  Menu,
  Portal,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { FiMapPin, FiMoreVertical } from 'react-icons/fi';
import { Toaster, toaster } from '@/components/ui/toaster';
import { getUserPlansWithSchedule, deletePlanByCreatedAt, updatePlanNameByCreatedAt } from '@/lib/api/firebase/plan';
import useGeocodeListStore from '@/store/useGeocodeListStore';
import usePlanStore from '@/store/usePlanInfoStore';
import usePolylineListStore from '@/store/usePolylineListStore';
import useSelectedPlanStore from '@/store/useSelectedPlanStore';
import { PlanWithSchedule } from '@/types/interface';
import PlanNameEditor from './PlanNameEditor';

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
  const queryClient = useQueryClient();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleCardClick = (planData: PlanWithSchedule) => {
    setSelectedPlan(planData.schedule);
    const firstPlan = planData.schedule[0];

    if (firstPlan?.travel?.origin) {
      setPlanInfo({
        geocode: firstPlan.travel.origin,
        formattedAddress: planData.createdAddress || '주소 정보 없음',
        routeType: planData.routeType,
        startTime: [firstPlan.start],
        endTime: [planData.schedule.at(-1)?.end ?? firstPlan.end],
      });
    }

    router.push('/plan?mode=result');
  };

  const handleMenuSelect = async (details: { value: string; planCreatedAt: string }) => {
    if (details.value === 'delete') {
      try {
        await deletePlanByCreatedAt(userId, details.planCreatedAt);
        toaster.create({ title: '일정이 삭제되었습니다.', type: 'success' });
        queryClient.invalidateQueries({ queryKey: ['userPlans', userId] });
      } catch (error: any) {
        toaster.create({
          title: '삭제 중 오류가 발생했습니다.',
          description: error.message || '알 수 없는 오류입니다.',
          type: 'error',
        });
      }
    }
  };

  const handlePlanNameSave = useCallback(
    async (createdAt: string, newName: string) => {
      try {
        await updatePlanNameByCreatedAt(userId, createdAt, newName);
        toaster.create({ title: '일정 제목이 수정되었습니다.', type: 'success' });
        queryClient.invalidateQueries({ queryKey: ['userPlans', userId] });
      } catch (error: any) {
        toaster.create({
          title: '수정 중 오류 발생',
          description: error.message || '알 수 없는 오류입니다.',
          type: 'error',
        });
      }
    },
    [userId, queryClient],
  );

  useEffect(() => {
    setPlanInfo(null);
  }, [setPlanInfo]);

  useEffect(() => {
    if (pathname === '/mypage') {
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
          {plans.map(plan => {
            const place = plan.schedule[1]?.placeDetails;

            return (
              <Stack
                key={plan.createdAt}
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
                align="stretch"
                wrap="nowrap"
                justify="space-between">
                <Image
                  src={place?.photo_url || place?.icon[0]}
                  alt="대표 이미지"
                  w={{ base: '100%', md: '160px' }}
                  h={{ base: '300px', md: '160px' }}
                  borderRadius="xl"
                  objectFit="cover"
                  onClick={() => handleCardClick(plan)}
                  cursor="pointer"
                />

                <VStack
                  align="start"
                  gap="1"
                  flex="1"
                  flexShrink={1}
                  minW={0}
                  w="full"
                  justify="center"
                  cursor="pointer"
                  onClick={() => handleCardClick(plan)}>
                  <PlanNameEditor
                    initialName={plan.planName || '일정 제목 없음'}
                    onSave={newName => handlePlanNameSave(plan.createdAt, newName)}
                  />
                  <Text fontSize="sm" color="gray.500">
                    {plan.schedule[0]?.start || '시작 시간 없음'} ~ {plan.schedule.at(-1)?.end || '종료 시간 없음'}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    총 방문지 {plan.schedule.filter(item => item.activityType !== 'move').length} 곳
                  </Text>

                  {isMobile ? (
                    <Flex justify="space-between" align="center" w="full" gap="2" flexWrap="nowrap">
                      <Flex align="center" gap="1" minW={0}>
                        <Icon as={FiMapPin} color="teal.500" boxSize="4" />
                        <Text
                          fontSize="sm"
                          color="gray.500"
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          truncate>
                          생성위치 : {plan.createdAddress || '위치 정보 없음'}
                        </Text>
                      </Flex>
                      <MenuTrigger createdAt={plan.createdAt} onSelect={handleMenuSelect} />
                    </Flex>
                  ) : (
                    <Flex align="center" gap="1">
                      <Icon as={FiMapPin} color="teal.500" boxSize="4" />
                      <Text fontSize="sm" color="gray.500">
                        생성위치 : {plan.createdAddress || '위치 정보 없음'}
                      </Text>
                    </Flex>
                  )}
                </VStack>

                {!isMobile && (
                  <Flex
                    direction="column"
                    align="flex-end"
                    justify="space-between"
                    minW="max-content"
                    maxW="140px"
                    flexShrink={0}>
                    <Flex align="center" gap="2" minW={0}>
                      <Text
                        fontSize="xs"
                        color="gray.400"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        truncate>
                        생성일 {new Date(plan.createdAt).toLocaleDateString()}
                      </Text>
                      <MenuTrigger createdAt={plan.createdAt} onSelect={handleMenuSelect} />
                    </Flex>
                  </Flex>
                )}
              </Stack>
            );
          })}
        </VStack>
      )}
      <Toaster />
    </Box>
  );
}

function MenuTrigger({
  createdAt,
  onSelect,
}: {
  createdAt: string;
  onSelect: (args: { value: string; planCreatedAt: string }) => void;
}) {
  return (
    <Menu.Root onSelect={value => onSelect({ value: value.value, planCreatedAt: createdAt })}>
      <Menu.Trigger asChild cursor="pointer" onClick={e => e.stopPropagation()}>
        <Icon as={FiMoreVertical} color="gray.400" boxSize="5" />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="delete">삭제</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

export default MyPlanList;
