import { Box, Flex } from '@chakra-ui/react';
import Header from '@/components/layout/Header';
import MyPageContent from './components/MyPageContent';

export default async function Page() {
  return (
    <Flex h="100vh" direction="column" px={{ xl: '15rem', lg: '10rem', base: '3rem' }}>
      <Header />
      <Box flex={1} borderWidth={3}>
        <MyPageContent />
      </Box>
    </Flex>
  );
}
