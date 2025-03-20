import { VStack, HStack, Text, Button, Icon } from '@chakra-ui/react';
import { FaExchangeAlt, FaArrowRight } from 'react-icons/fa';
import { PlanInfo } from '@/types/interface';

interface RouteSelectorProps {
  routeType: string;
  onUpdate: (updates: Partial<PlanInfo>) => void;
}

function RouteSelector({ routeType, onUpdate }: RouteSelectorProps) {
  return (
    <VStack align="center" gap={3} w="100%" p={4} bg="gray.50" borderRadius="lg" boxShadow="sm">
      <Text fontSize="lg" fontWeight="bold" color="gray.700">
        이동 경로를 선택하세요
      </Text>

      <HStack gap={4}>
        {/* 왕복 버튼 */}
        <Button
          colorPalette={routeType === '왕복' ? 'blue' : 'gray'}
          variant={routeType === '왕복' ? 'solid' : 'outline'}
          onClick={() => onUpdate({ routeType: '왕복' })}
          size="md"
          w="100px"
          display="flex"
          alignItems="center"
          gap={2}>
          <Icon as={FaExchangeAlt} />
          왕복
        </Button>

        {/* 편도 버튼 */}
        <Button
          colorPalette={routeType === '편도' ? 'green' : 'gray'}
          variant={routeType === '편도' ? 'solid' : 'outline'}
          onClick={() => onUpdate({ routeType: '편도' })}
          size="md"
          w="100px"
          display="flex"
          alignItems="center"
          gap={2}>
          <Icon as={FaArrowRight} />
          편도
        </Button>
      </HStack>

      {/* 선택된 값 표시 */}
      {routeType && (
        <Text fontSize="md" fontWeight="medium" color="blue.500">
          선택된 이동 방식: {routeType}
        </Text>
      )}
    </VStack>
  );
}

export default RouteSelector;
