'use client';

import { Box, Button, VStack, Text, Flex, IconButton, Link } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import ResetPasswordModal from '@/components/modal/ResetPasswordModal';
import { toaster, Toaster } from '@/components/ui/toaster';
import { loginUser, loginWithGoogle } from '@/lib/api/firebase/auth';
import FormField from '../../components/FormField';
import PasswordInput from '../../components/PasswordInput';

export default function LoginRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const handleLogin = async () => {
    try {
      await loginUser({ email, password });
      toaster.create({ description: '로그인에 성공하였습니다.', type: 'success' });
      setTimeout(() => (redirect ? router.replace(redirect) : router.push('/')), 1000);
    } catch (err: any) {
      console.error('로그인 실패:', err);
      toaster.create({ description: '로그인에 실패하였습니다.', type: 'error' });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toaster.create({ description: '로그인에 성공하였습니다.', type: 'success' });
      setTimeout(() => (redirect ? router.replace(redirect) : router.push('/')), 1000);
    } catch (err: any) {
      console.error('구글 로그인 실패:', err);
      toaster.create({ description: '로그인에 실패하였습니다.', type: 'error' });
    }
  };

  const toggleModal = () => setIsOpen(prev => !prev);

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
        if (e.key === 'Enter') {
          if (!isOpen) handleLogin();
        }
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

        <FormField
          label="이메일"
          isRequired
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <FormField label="비밀번호" isRequired>
          <PasswordInput value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호 입력" />
        </FormField>

        <Box w="fit-content" ml="auto">
          <Text
            fontSize="sm"
            color="gray.500"
            pr={1}
            onClick={toggleModal}
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
      <ResetPasswordModal isOpen={isOpen} onToggle={toggleModal} />
    </Box>
  );
}
