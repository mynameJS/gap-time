import { useState } from 'react';
import { Box, Button, VStack } from '@chakra-ui/react';
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from '@/components/ui/dialog';
import usePlanStore from '@/store/usePlanInfoStore';
import TimeSelector from './TimeSelector';
import TransportPicker from './TransportPicker';
import LocationPicker from './LocationPicker';
import RouteSelector from './RouteSelector';
import { PlanInfo } from '@/types/interface';
import generateSchedule from '@/utils/generateSchedule';
import { fetchDistanceMatrix } from '@/lib/api/distance';
import calculateTravelTimes from '@/utils/calculateTravelTimes';

function PlanInfoModal() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [planInfo, setPlanInfo] = useState<PlanInfo>({
    startTime: [],
    endTime: [],
    transport: '',
    geocode: { lat: 0, lng: 0 },
    formattedAddress: '',
    routeType: '',
  });

  const { setPlanInfo: setGlobalPlanInfo } = usePlanStore();
  const handleUpdatePlanInfo = (updates: Partial<PlanInfo>) => {
    setPlanInfo(prevInfo => ({ ...prevInfo, ...updates }));
  };

  // 저장 버튼 클릭 시 전역 상태 업데이트
  const handleSave = async () => {
    setGlobalPlanInfo(planInfo);
    setIsOpen(false);

    // const testparams = {
    //   startTime: planInfo.startTime[0],
    //   endTime: planInfo.endTime[0],
    //   latitude: planInfo.geocode.lat,
    //   longitude: planInfo.geocode.lng,
    // };
    // const testparams = {
    //   startTime: planInfo.startTime[0],
    //   endTime: planInfo.endTime[0],
    //   latitude: planInfo.geocode.lat,
    //   longitude: planInfo.geocode.lng,
    // };

    // const result = await generateSchedule(testparams);

    // const finaltestparams = {
    //   schedule: result,
    //   // mode: planInfo.transport === '도보' ? 'walking' : 'driving',
    //   mode: 'transit',
    //   routeType: '왕복',
    //   currentLocation: planInfo.geocode,
    // };
    // const finalResult = await calculateTravelTimes(finaltestparams);

    // console.log(finalResult);

    // const testparams = {
    //   origin: planInfo.geocode,
    //   destination: 'ChIJt9JrGUC5fDURm12ziVmivsk',
    //   mode: 'driving',
    // };

    // const result = await fetchDistanceMatrix(testparams);
    // console.log(result);
  };

  return (
    <DialogRoot open={isOpen}>
      <DialogContent width="60%" height="80%" maxWidth="90vw" maxHeight="80vh" margin="auto" borderRadius={10}>
        <DialogHeader>
          <DialogTitle>일정 추천을 위한 사전 질문</DialogTitle>
        </DialogHeader>
        <DialogBody borderWidth={3}>
          <VStack align="center" gap={4}>
            <TimeSelector startTime={planInfo.startTime} endTime={planInfo.endTime} onUpdate={handleUpdatePlanInfo} />
            <TransportPicker transport={planInfo.transport} onUpdate={handleUpdatePlanInfo} />
            <RouteSelector routeType={planInfo.routeType} onUpdate={handleUpdatePlanInfo} />
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
