import { Suspense } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import PlanRouteGuard from './components/PlanRouteGuard';
import PlanDrawer from './components/PlanDrawer/PlanDrawer';
import GoogleMaps from './components/Maps/GoogleMap';

export default async function Page() {
  return (
    <>
      <PlanRouteGuard />
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
