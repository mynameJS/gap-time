'use client';

import { Box, Button, Input, Text, VStack, Field, Link, Flex, IconButton } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Toaster, toaster } from '@/components/ui/toaster';
import { loginUser, loginWithGoogle } from '@/lib/api/firebase/auth';

function LoginRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect'); // ✅ redirect 쿼리 추출

  const handleLogin = async () => {
    try {
      await loginUser({ email, password });
      toaster.create({ description: '로그인에 성공하였습니다.', type: 'success' });

      setTimeout(() => {
        if (redirect) {
          router.replace(redirect); // ✅ 쿼리 경로로 이동
        } else {
          router.push('/');
        }
      }, 1000);
    } catch (err: any) {
      console.error('로그인 실패:', err);
      toaster.create({ description: '로그인에 실패하였습니다.', type: 'error' });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toaster.create({ description: '로그인에 성공하였습니다.', type: 'success' });

      setTimeout(() => {
        if (redirect) {
          router.replace(redirect); // ✅ 쿼리 경로로 이동
        } else {
          router.push('/');
        }
      }, 1000);
    } catch (err: any) {
      console.error('구글 로그인 실패:', err);
      toaster.create({ description: '로그인에 실패하였습니다.', type: 'error' });
    }
  };

  return (
    <Box
      w="100%"
      minW="400px"
      maxW="500px"
      mx="auto"
      mt="10"
      p="8"
      borderWidth={1}
      borderRadius="xl"
      boxShadow="md"
      bg="white"
      onKeyDown={e => {
        if (e.key === 'Enter') handleLogin();
      }}>
      <VStack gap={5} align="stretch">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          color="teal.600"
          onClick={() => router.push('/')}
          cursor="pointer">
          틈새시간
        </Text>

        <Field.Root required>
          <Field.Label>
            이메일 <Field.RequiredIndicator />
          </Field.Label>
          <Input type="email" placeholder="example@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        </Field.Root>

        <Field.Root required>
          <Field.Label>
            비밀번호 <Field.RequiredIndicator />
          </Field.Label>
          <Input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Field.Root>

        <Box w="fit-content" ml="auto">
          <Text
            fontSize="sm"
            color="gray.500"
            textAlign="right"
            pr={1}
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}>
            비밀번호를 잊으셨나요?
          </Text>
        </Box>

        <Button colorPalette="teal" onClick={handleLogin}>
          로그인
        </Button>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          아직 회원이 아니세요?{' '}
          <Link color="teal.500" fontWeight="semibold" onClick={() => router.push('/signup')}>
            이메일회원가입
          </Link>
        </Text>

        <VStack gap={3}>
          <Text fontSize="sm" color="gray.600" textAlign="center">
            SNS 간편 로그인
          </Text>
          <Flex gap={4} justify="center">
            <IconButton
              size="xl"
              aria-label="구글 로그인"
              variant="outline"
              onClick={handleGoogleLogin}
              bg="white"
              border="1px solid #ddd"
              _hover={{ bg: 'gray.50' }}>
              <FcGoogle />
            </IconButton>
          </Flex>
        </VStack>
      </VStack>
      <Toaster />
    </Box>
  );
}

export default LoginRegister;
