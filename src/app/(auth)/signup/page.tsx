import { VStack } from '@chakra-ui/react';
import SignUpRegister from './components/SignUpRegister';

export default async function Page() {
  return (
    <VStack w="100%" h="100%" align="center" justify="center">
      <SignUpRegister />
    </VStack>
  );
}
