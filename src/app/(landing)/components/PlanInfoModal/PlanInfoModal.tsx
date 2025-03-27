'use client';

import { useState } from 'react';
import { Button, VStack, HStack, Text, Icon, Flex } from '@chakra-ui/react';
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from '@/components/ui/dialog';
import { FaClock, FaMapMarkerAlt, FaRoute } from 'react-icons/fa';
import usePlanStore from '@/store/usePlanInfoStore';
import TimeSelector from './TimeSelector';
import LocationPicker from './LocationPicker';
import RouteSelector from './RouteSelector';
import { PlanInfo } from '@/types/interface';
import { useRouter } from 'next/navigation';

interface PlanInfoModalProps {
  isOpen: boolean;
  onToggle: () => void;
}

function PlanInfoModal({ isOpen, onToggle }: PlanInfoModalProps) {
  const [planInfo, setPlanInfo] = useState<PlanInfo>({
    startTime: [],
    endTime: [],
    transport: '',
    geocode: { lat: 0, lng: 0 },
    formattedAddress: '',
    routeType: '',
  });

  const router = useRouter();

  const { setPlanInfo: setGlobalPlanInfo } = usePlanStore();
  const handleUpdatePlanInfo = (updates: Partial<PlanInfo>) => {
    setPlanInfo(prevInfo => ({ ...prevInfo, ...updates }));
  };

  // mode value 값 받아서 plan 페이지로 이동
  const handleRouterClick = (mode: string) => {
    setGlobalPlanInfo(planInfo);
    onToggle();
    router.push(`plan?mode=${mode}`);
  };

  return (
    <DialogRoot open={isOpen}>
      <DialogContent
        width="50%"
        height="90%"
        maxWidth="90vw"
        maxHeight="90vh"
        margin="auto"
        borderRadius={12}
        boxShadow="xl"
        p={6}>
        <DialogHeader>
          <DialogTitle fontSize="2xl" fontWeight="bold" textAlign="center">
            일정 추천을 위한 사전 질문
          </DialogTitle>
        </DialogHeader>

        <DialogBody p={4} borderWidth={3}>
          <VStack align="stretch" gap={5}>
            {/* 시간 선택 */}
            <Flex direction="column" gap={4}>
              <HStack>
                <Icon as={FaClock} color="blue.400" />
                <Text fontSize="md" fontWeight="bold">
                  여행 시간 선택
                </Text>
              </HStack>
              <TimeSelector startTime={planInfo.startTime} endTime={planInfo.endTime} onUpdate={handleUpdatePlanInfo} />
            </Flex>
            {/* 루트 타입 선택 */}
            <Flex direction="column" gap={4}>
              <HStack>
                <Icon as={FaRoute} color="purple.400" />
                <Text fontSize="md" fontWeight="bold">
                  이동 방식 선택
                </Text>
              </HStack>
              <RouteSelector routeType={planInfo.routeType} onUpdate={handleUpdatePlanInfo} />
            </Flex>

            {/* 위치 선택 */}
            <Flex direction="column" gap={4}>
              <HStack>
                <Icon as={FaMapMarkerAlt} color="red.400" />
                <Text fontSize="md" fontWeight="bold">
                  출발 위치 설정
                </Text>
              </HStack>
              <LocationPicker formattedAddress={planInfo.formattedAddress} onUpdate={handleUpdatePlanInfo} />
            </Flex>
          </VStack>
        </DialogBody>

        <DialogFooter mt={4} justifyContent="center">
          <HStack gap={4}>
            <Button colorPalette="blue" onClick={() => handleRouterClick('result')} size="lg">
              추천 일정 만들기
            </Button>
            <Button variant="outline" colorPalette="gray" size="lg" onClick={() => handleRouterClick('select')}>
              직접 장소 선택하기
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export default PlanInfoModal;
