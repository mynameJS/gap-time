import { Box, Flex, HStack, Text, Button, Image } from '@chakra-ui/react';

export default function Header() {
  return (
    <Box w="100%" as="header" bg="white" py={6}>
      <Flex justify="space-between" align="center">
        {/* 로고 영역 */}
        <HStack>
          <Image src="/image/logo_2.png" alt="로고 이미지" w="28px" />
          <Text fontSize="xl" fontWeight="bold" color="teal.600" letterSpacing="-0.5px" userSelect="none">
            틈새시간
          </Text>
        </HStack>

        {/* 버튼 영역 */}
        <HStack gap={4}>
          <Button colorPalette="teal" variant="ghost" borderRadius="md" px={6} _hover={{ bg: 'teal.50' }}>
            회원가입
          </Button>
          <Button colorPalette="teal" borderRadius="md" px={6}>
            로그인
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}
