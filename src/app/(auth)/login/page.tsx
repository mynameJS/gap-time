import { VStack } from '@chakra-ui/react';
import LoginRegister from './components/LoginRegister';

export default async function Page() {
  return (
    <VStack w="100%" h="100%" align="center" justify="center">
      <LoginRegister />
    </VStack>
  );
}
