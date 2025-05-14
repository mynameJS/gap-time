import { Box, Flex, Spinner } from '@chakra-ui/react';
import { Suspense } from 'react';
import GoogleMaps from './components/Maps/GoogleMap';
import PlanDrawer from './components/PlanDrawer/PlanDrawer';
import PlanRouteGuard from './components/PlanRouteGuard';

export default async function Page() {
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <PlanRouteGuard />
      </Suspense>
      <Box height="100%" width="100%">
        <Flex flexDir={{ base: 'column-reverse', md: 'row' }} height="100%" width="100%" position="relative">
          <Suspense fallback={<Spinner />}>
            <PlanDrawer />
          </Suspense>
          <Suspense fallback={<Spinner />}>
            <GoogleMaps />
          </Suspense>
        </Flex>
      </Box>
    </>
  );
}
