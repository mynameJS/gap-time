'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Flex, HStack, Text, Button, Image, Avatar, Menu, Portal, Spinner } from '@chakra-ui/react';
import MyInfoModal from '../modal/MyInfoModal/MyInfoModal';
import { logoutUser, getUserInfo } from '@/lib/api/firebase/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(prev => !prev);

  const router = useRouter();
  const queryClient = useQueryClient();

  const uid = JSON.parse(sessionStorage.getItem('user') || '{}')?.uid;

  const { data: user, isLoading } = useQuery({
    queryKey: ['userInfo', uid],
    queryFn: () => getUserInfo(uid),
    enabled: !!uid,
    staleTime: 1000 * 60 * 5,
  });

  // ✅ 메뉴 선택 핸들러
  const handleMenuSelect = async (details: { value: string }) => {
    const selected = details.value;

    if (selected === 'mypage') {
      router.push('/mypage');
    } else if (selected === 'logout') {
      await logoutUser();
      queryClient.removeQueries({ queryKey: ['userInfo', uid] });
      router.replace('/');
    } else if (selected === 'myinfo') {
      setIsOpen(true); // ✅ 모달 열기
    }
  };

  return (
    <Box w="100%" as="header" bg="white" py={6}>
      <Flex justify="space-between" align="center">
        {/* 로고 */}
        <HStack>
          <Image src="/image/logo_2.png" alt="로고 이미지" w="28px" />
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="teal.600"
            letterSpacing="-0.5px"
            userSelect="none"
            cursor="pointer"
            onClick={() => router.push('/')}>
            틈새시간
          </Text>
        </HStack>

        {/* 로그인 상태에 따른 렌더링 */}
        {isLoading ? (
          <Spinner color="teal.500" size="sm" />
        ) : user ? (
          <Box cursor="pointer">
            <Menu.Root onSelect={handleMenuSelect}>
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
                    <Menu.Item value="myinfo">내 정보</Menu.Item> {/* ✅ */}
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
              onClick={() => router.push('/signup')}>
              회원가입
            </Button>
            <Button colorPalette="teal" borderRadius="md" px={6} onClick={() => router.push('/login')}>
              로그인
            </Button>
          </HStack>
        )}
      </Flex>

      {/* ✅ 모달 렌더링 */}
      {user && <MyInfoModal isOpen={isOpen} onToggle={handleToggle} userInfo={user} />}
    </Box>
  );
}
