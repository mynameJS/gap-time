'use client';

import { useState } from 'react';
import { Button, VStack, HStack, Text, Box, useToast } from '@chakra-ui/react';
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from '@/components/ui/dialog';
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
    geocode: { lat: 0, lng: 0 },
    formattedAddress: '',
    routeType: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [missing, setMissing] = useState({
    startTime: false,
    endTime: false,
    routeType: false,
    formattedAddress: false,
  });

  const router = useRouter();
  const { setPlanInfo: setGlobalPlanInfo } = usePlanStore();

  const handleUpdatePlanInfo = (updates: Partial<PlanInfo>) => {
    setPlanInfo(prev => ({ ...prev, ...updates }));
    setMissing(prev => ({
      ...prev,
      ...Object.keys(updates).reduce((acc, key) => {
        acc[key as keyof PlanInfo] = false;
        return acc;
      }, {} as any),
    }));
  };

  const validate = () => {
    const newMissing = {
      startTime: planInfo.startTime.length === 0,
      endTime: planInfo.endTime.length === 0,
      routeType: planInfo.routeType === '',
      formattedAddress: planInfo.formattedAddress === '',
    };
    setMissing(newMissing);

    const isValid = !Object.values(newMissing).includes(true);
    if (!isValid) {
      setErrorMessage('모든 항목을 입력해주세요.');
    } else {
      setErrorMessage('');
    }
    return isValid;
  };

  const handleRouterClick = (mode: string) => {
    if (!validate()) return;
    setGlobalPlanInfo(planInfo);
    onToggle();
    router.push(`plan?mode=${mode}`);
  };

  return (
    <DialogRoot open={isOpen} onEscapeKeyDown={onToggle}>
      <DialogContent
        w={{ base: '100%', md: '60%', xl: '40%' }}
        h={{ base: 'auto', md: '90%' }}
        maxW="90vw"
        maxHeight="90vh"
        mx="auto"
        my="auto"
        borderRadius="xl"
        boxShadow="2xl"
        p={{ base: 6, md: 10 }}
        bg="white"
        overflow="auto">
        <DialogHeader>
          <DialogTitle fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" textAlign="center" mb={2}>
            <Text>일정 추천을 위한 사전 질문</Text>
          </DialogTitle>
        </DialogHeader>

        <DialogBody p={0}>
          <VStack align="stretch" gap={5}>
            <TimeSelector
              startTime={planInfo.startTime}
              endTime={planInfo.endTime}
              onUpdate={handleUpdatePlanInfo}
              isInvalid={missing.startTime || missing.endTime}
            />

            <RouteSelector
              routeType={planInfo.routeType}
              onUpdate={handleUpdatePlanInfo}
              isInvalid={missing.routeType}
            />

            <LocationPicker
              formattedAddress={planInfo.formattedAddress}
              onUpdate={handleUpdatePlanInfo}
              isInvalid={missing.formattedAddress}
            />
          </VStack>
        </DialogBody>

        <DialogFooter mt={6} flexDirection="column">
          <HStack gap={4}>
            <Button colorPalette="teal" size="lg" px={8} onClick={() => handleRouterClick('result')}>
              추천 일정 만들기
            </Button>
            <Button variant="outline" colorPalette="gray" size="lg" px={8} onClick={() => handleRouterClick('select')}>
              직접 장소 선택하기
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export default PlanInfoModal;
