import { Box, Flex, Stack, Text, Button } from '@chakra-ui/react';

export default function Header() {
  return (
    <Box as="header" bg="gray.100" py={4} px={8}>
      {/* Flex: 헤더의 전체 레이아웃 구성 */}
      <Flex justify="space-between" align="center">
        {/* 로고 영역 */}
        <Text fontSize="xl" fontWeight="bold" color="teal.500">
          틈새시간
        </Text>

        {/* 버튼 영역: Stack으로 수평 정렬 */}
        <Stack direction="row" gap={4}>
          <Button colorScheme="teal" variant="outline">
            회원가입
          </Button>
          <Button colorScheme="teal">로그인</Button>
        </Stack>
      </Flex>
    </Box>
  );
}
