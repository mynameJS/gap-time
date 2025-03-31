import { Flex, VStack, HStack, Text, Button, Icon } from '@chakra-ui/react';
import { FaExchangeAlt, FaArrowRight, FaRoute } from 'react-icons/fa';
import { PlanInfo } from '@/types/interface';

interface RouteSelectorProps {
  routeType: string;
  onUpdate: (updates: Partial<PlanInfo>) => void;
  isInvalid: boolean;
}

function RouteSelector({ routeType, onUpdate, isInvalid }: RouteSelectorProps) {
  return (
    <Flex direction="column" gap={4}>
      {/* 상단 라벨 */}
      <HStack>
        <Icon as={FaRoute} color="teal.500" />
        <Text fontSize="md" fontWeight="bold">
          이동 경로 선택
        </Text>
        {isInvalid && (
          <Text fontSize="xs" color="red.400" ml={2}>
            (필수 항목입니다)
          </Text>
        )}
      </HStack>

      {/* 선택 카드 */}
      <VStack align="center" gap={5} w="100%" p={6} bg="gray.50" borderRadius="xl" boxShadow="sm">
        <Text fontSize="lg" fontWeight="semibold" color="gray.700">
          이동 경로를 선택하세요
        </Text>

        {/* 버튼 그룹 (반응형 Stack) */}
        <Flex gap={4} w="100%" justify="center" align="center">
          <Button
            colorPalette={routeType === '왕복' ? 'teal' : 'gray'}
            variant={routeType === '왕복' ? 'solid' : 'outline'}
            onClick={() => onUpdate({ routeType: '왕복' })}
            size="md"
            w={{ base: '100%', sm: '120px' }}
            borderRadius="md">
            <Icon as={FaExchangeAlt} />
            왕복
          </Button>

          <Button
            colorPalette={routeType === '편도' ? 'teal' : 'gray'}
            variant={routeType === '편도' ? 'solid' : 'outline'}
            onClick={() => onUpdate({ routeType: '편도' })}
            size="md"
            w={{ base: '100%', sm: '120px' }}
            borderRadius="md">
            <Icon as={FaArrowRight} />
            편도
          </Button>
        </Flex>

        {/* 선택 결과 */}
        {routeType && (
          <Text fontSize="sm" fontWeight="medium" color="teal.600">
            선택된 이동 방식: <strong>{routeType}</strong>
          </Text>
        )}
      </VStack>
    </Flex>
  );
}

export default RouteSelector;
