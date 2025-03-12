import { VStack, HStack, Text, Button } from '@chakra-ui/react';
import { PlanInfo } from '@/types/interface';

interface RouteSelectorProps {
  routeType: string;
  onUpdate: (updates: Partial<PlanInfo>) => void;
}

function RouteSelector({ routeType, onUpdate }: RouteSelectorProps) {
  return (
    <VStack align="center">
      <Text>이동 경로가 어떻게 되나요?</Text>
      <HStack>
        <Button variant={'surface'} onClick={() => onUpdate({ routeType: '왕복' })}>
          왕복
        </Button>
        <Button variant={'surface'} onClick={() => onUpdate({ routeType: '편도' })}>
          편도
        </Button>
      </HStack>
      <Text>{routeType}</Text>
    </VStack>
  );
}

export default RouteSelector;
