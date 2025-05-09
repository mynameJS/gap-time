'use client';

import { Box, Flex, HStack, Text, Button, Image, Avatar, Menu, Portal, Spinner } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logoutUser, getUserInfo } from '@/lib/api/firebase/auth';

const MyInfoModal = dynamic(() => import('../modal/MyInfoModal/MyInfoModal'), {
  ssr: false,
  loading: () => null,
});

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const handleToggle = () => setIsOpen(prev => !prev);

  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    const parsed = user ? JSON.parse(user) : null;
    if (parsed?.uid) {
      setUid(parsed.uid);
    }
  }, []);

  const { data: user, isLoading } = useQuery({
    queryKey: ['userInfo', uid],
    queryFn: () => getUserInfo(uid!),
    enabled: !!uid,
    staleTime: 1000 * 60 * 5,
  });

  const handleMenuSelect = async (details: { value: string }) => {
    const selected = details.value;

    if (selected === 'mypage') {
      router.push('/mypage');
    } else if (selected === 'logout') {
      await logoutUser();
      queryClient.removeQueries({ queryKey: ['userInfo', uid] });
      setUid(null);
      router.push('/');
    } else if (selected === 'myinfo') {
      setIsOpen(true);
    }
  };

  return (
    <Box w="100%" as="header" bg="white" py={6}>
      <Flex justify="space-between" align="center">
        <HStack>
          <Image src="/image/logo.webp" alt="로고 이미지" width="28px" height="28px" />
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
                    <Menu.Item value="myinfo">내 정보</Menu.Item>
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

      {user && <MyInfoModal isOpen={isOpen} onToggle={handleToggle} userInfo={user} />}
    </Box>
  );
}
