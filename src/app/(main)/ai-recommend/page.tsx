import { Box, Flex } from '@chakra-ui/react';
import PlaceGPTTester from './components/PlaceGPTTester';

export default async function Page() {
  return (
    <Flex h="100vh" direction="column" px={{ xl: '15rem', lg: '10rem', base: '3rem' }}>
      <Box flex={1}>
        <PlaceGPTTester />
      </Box>
    </Flex>
  );
}
