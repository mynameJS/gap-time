'use client';

import { Box, Button, Heading, Text, VStack, Flex } from '@chakra-ui/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Flex direction="column" align="center" justify="center" h="100vh" bg="gray.50" px={6} textAlign="center">
      <VStack gap={8}>
        <Heading fontSize={{ base: '7xl', md: '9xl' }} fontWeight="bold" color="teal" mb={{ base: '2', md: '10' }}>
          404
        </Heading>
        <Box>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color="teal" mt={4}>
            해당 페이지는 존재하지 않아요.
          </Text>
          <Text fontSize="md" color="gray.500" mt={2}>
            요청하신 주소를 다시 확인해주세요.
          </Text>
        </Box>
      </VStack>

      <VStack gap={4} mt={8}>
        <Link href="/" passHref>
          <Button colorPalette="teal" size="lg" px={6} borderRadius="2xl" boxShadow="md">
            홈으로 돌아가기
          </Button>
        </Link>
        <Text fontSize="xs" color="gray.400">
          서비스에 문제가 있다면 관리자에게 문의해주세요
        </Text>
      </VStack>
    </Flex>
  );
}
