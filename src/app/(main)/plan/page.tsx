import { Box, Flex } from '@chakra-ui/react';
import StepDrawer from './components/StepDrawer';
import KakaoMap from './components/KakaoMap';

export default async function Page() {
  return (
    <Box height="100%" width="100%">
      <Flex align="center" height="100%" width="100%" position="relative">
        <StepDrawer />
        <KakaoMap />
      </Flex>
    </Box>
  );
}
