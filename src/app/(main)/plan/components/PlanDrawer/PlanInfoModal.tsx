import { useState } from 'react';
import { Button, VStack } from '@chakra-ui/react';
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from '@/components/ui/dialog';
import usePlanStore from '@/store/usePlanInfoStore';
import TimeSelector from './TimeSelector';
import TransportPicker from './TransportPicker';
import LocationPicker from './LocationPicker';
import { PlanInfo } from '@/types/interface';
// import generateSchedule from '@/utils/generateSchedule';

function PlanInfoModal() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [planInfo, setPlanInfo] = useState<PlanInfo>({
    startTime: [],
    endTime: [],
    transport: '',
    geocode: { lat: 0, lng: 0 },
    formattedAddress: '',
  });

  // const test = generateSchedule('10:00', '12:00');
  // console.log(test);

  const { setPlanInfo: setGlobalPlanInfo } = usePlanStore();
  const handleUpdatePlanInfo = (updates: Partial<PlanInfo>) => {
    setPlanInfo(prevInfo => ({ ...prevInfo, ...updates }));
  };

  // 저장 버튼 클릭 시 전역 상태 업데이트
  const handleSave = () => {
    setGlobalPlanInfo(planInfo);
    setIsOpen(false);
  };

  return (
    <DialogRoot open={isOpen}>
      <DialogContent width="60%" height="80%" maxWidth="90vw" maxHeight="80vh" margin="auto">
        <DialogHeader borderWidth={3}>
          <DialogTitle>일정 추천을 위한 사전 질문</DialogTitle>
        </DialogHeader>
        <DialogBody borderWidth={3}>
          <VStack align="center" gap={4}>
            <TimeSelector startTime={planInfo.startTime} endTime={planInfo.endTime} onUpdate={handleUpdatePlanInfo} />
            <TransportPicker transport={planInfo.transport} onUpdate={handleUpdatePlanInfo} />
            <LocationPicker formattedAddress={planInfo.formattedAddress} onUpdate={handleUpdatePlanInfo} />
          </VStack>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={handleSave}>
            맞춤 일정 만들기
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export default PlanInfoModal;
