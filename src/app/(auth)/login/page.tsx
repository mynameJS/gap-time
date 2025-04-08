import { VStack, Spinner } from '@chakra-ui/react';
import { Suspense } from 'react';
import LoginRegister from './components/LoginRegister';

export default async function Page() {
  return (
    <VStack w="100%" h="100%" align="center" justify="center">
      <Suspense fallback={<Spinner />}>
        <LoginRegister />
      </Suspense>
    </VStack>
  );
}
