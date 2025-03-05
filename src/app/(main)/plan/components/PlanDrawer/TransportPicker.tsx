import { useState } from 'react';
import { VStack, HStack, Text, IconButton } from '@chakra-ui/react';
import { FaPersonWalking, FaCar } from 'react-icons/fa6';

function TransportPicker() {
  const [transport, setTransport] = useState<string>('');

  return (
    <VStack align="center">
      <Text>이동수단이 무엇인가요?</Text>
      <HStack>
        <IconButton variant={'surface'} onClick={() => setTransport('도보')}>
          <FaPersonWalking />
        </IconButton>
        <IconButton variant={'surface'} onClick={() => setTransport('자동차')}>
          <FaCar />
        </IconButton>
      </HStack>
      <Text>{transport}</Text>
    </VStack>
  );
}

export default TransportPicker;
