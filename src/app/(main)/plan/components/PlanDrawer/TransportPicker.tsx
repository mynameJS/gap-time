import { VStack, HStack, Text, IconButton } from '@chakra-ui/react';
import { FaPersonWalking, FaCar } from 'react-icons/fa6';
import { PlanInfo } from '@/types/interface';

interface TransportPickerProps {
  transport: string;
  onUpdate: (updates: Partial<PlanInfo>) => void;
}

function TransportPicker({ transport, onUpdate }: TransportPickerProps) {
  return (
    <VStack align="center">
      <Text>이동수단이 무엇인가요?</Text>
      <HStack>
        <IconButton variant={'surface'} onClick={() => onUpdate({ transport: '도보' })}>
          <FaPersonWalking />
        </IconButton>
        <IconButton variant={'surface'} onClick={() => onUpdate({ transport: '자동차' })}>
          <FaCar />
        </IconButton>
      </HStack>
      <Text>{transport}</Text>
    </VStack>
  );
}

export default TransportPicker;
