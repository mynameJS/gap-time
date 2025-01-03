import { Box, Flex } from '@chakra-ui/react';

export default async function Page() {
  return (
    <Box borderWidth="3px" height="100%" borderColor="black" padding={10}>
      <Flex align="center" borderWidth="3px" height="100%" width="100%">
        <Box width="50%" height="100%">
          플랜영역
        </Box>
        <Box borderWidth="3px" width="50%" height="100%">
          카카오지도 영역
        </Box>
      </Flex>
    </Box>
  );
}
