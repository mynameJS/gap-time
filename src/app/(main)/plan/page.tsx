import { Box, Flex } from '@chakra-ui/react';
import PlanDrawer from './components/PlanDrawer/PlanDrawer';
import GoogleMaps from './components/Maps/GoogleMap';

export default async function Page() {
  return (
    <Box height="100%" width="100%">
      <Flex flexDir={{ base: 'column-reverse', md: 'row' }} height="100%" width="100%" position="relative">
        <PlanDrawer />
        <GoogleMaps />
      </Flex>
    </Box>
  );
}
