'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Flex, HStack, Text, Button, Image, Avatar, Menu, Portal } from '@chakra-ui/react';
import { logoutUser } from '@/lib/api/firebase/auth';

interface UserInfo {
  uid: string;
  email: string;
  nickname: string;
}

export default function LandingHeader() {
  const route = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

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

        {/* 유저 상태에 따른 렌더링 */}
        {user ? (
          <Box cursor="pointer">
            <Menu.Root
              onSelect={async details => {
                const selected = details.value;
                if (selected === 'mypage') {
                  route.push('/mypage');
                } else if (selected === 'logout') {
                  await logoutUser();
                  setUser(null);
                }
              }}>
              <Menu.Trigger asChild>
                <HStack gap={3} pr={2}>
                  <Avatar.Root variant="solid" colorPalette="teal">
                    <Avatar.Fallback name={user.nickname} />
                  </Avatar.Root>
                  <Text fontWeight="medium" fontSize="sm" color="gray.700">
                    {user.nickname}
                  </Text>
                </HStack>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="mypage">마이페이지</Menu.Item>
                    <Menu.Item value="logout">로그아웃</Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Box>
        ) : (
          <HStack gap={4}>
            <Button
              colorPalette="teal"
              variant="ghost"
              borderRadius="md"
              px={6}
              _hover={{ bg: 'teal.50' }}
              onClick={() => route.push('/signup')}>
              회원가입
            </Button>
            <Button colorPalette="teal" borderRadius="md" px={6} onClick={() => route.push('/login')}>
              로그인
            </Button>
          </HStack>
        )}
      </Flex>
    </Box>
  );
}
