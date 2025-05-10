'use client';

import { Box, Button, VStack, Text, Link, Spinner, HStack, Input } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { InputGroup } from '@/components/ui/input-group';
import { toaster, Toaster } from '@/components/ui/toaster';
import useEmailVerification from '@/hooks/useVerificationTimer';
import { registerUser } from '@/lib/api/firebase/auth';
import {
  validateEmail,
  validateNickname,
  validatePassword,
  validatePasswordConfirm,
} from '@/utils/validation/signupValidation';
import FormField from '../../components/FormField';
import PasswordInput from '../../components/PasswordInput';

function SignUpRegister() {
  const {
    email,
    setEmail,
    codeInput,
    setCodeInput,
    isVerified,
    emailStatus,
    seconds,
    sendCode,
    verify,
    resetVerification,
  } = useEmailVerification();

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
  });

  const router = useRouter();

  const validateAll = () => {
    const newErrors = {
      email: validateEmail(email),
      nickname: validateNickname(nickname),
      password: validatePassword(password),
      passwordConfirm: validatePasswordConfirm(password, passwordConfirm),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleSubmit = async () => {
    if (!isVerified) {
      toaster.create({ description: '이메일 인증을 먼저 완료해주세요.', type: 'error' });
      return;
    }

    if (!validateAll()) return;

    try {
      await registerUser({ email, password, nickname });
      toaster.create({ description: '회원가입이 완료되었습니다 🎉', type: 'success' });
      router.push('/login');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toaster.create({ description: '이미 가입된 이메일입니다.', type: 'error' });
        resetVerification();
      } else {
        toaster.create({ description: error.message || '회원가입 중 문제가 발생했습니다.', type: 'error' });
      }
    }
  };

  return (
    <Box w="100%" maxW="500px" mx="auto" mt="10" p="8" borderWidth={1} borderRadius="xl" boxShadow="md" bg="white">
      <VStack gap={5} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" color="teal" textAlign="center">
          회원가입
        </Text>

        <FormField label="이메일" isRequired error={errors.email}>
          <HStack align="start" w="100%">
            <Input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setErrors(prev => ({ ...prev, email: validateEmail(email) }))}
              disabled={isVerified}
              flex="1"
            />
            <Button onClick={sendCode} colorPalette="teal" disabled={isVerified || emailStatus === 'pending'}>
              {isVerified ? '완료' : emailStatus === 'pending' ? <Spinner size="sm" /> : '인증'}
            </Button>
          </HStack>
        </FormField>

        {!isVerified && emailStatus === 'sent' && (
          <FormField label="인증번호" isRequired>
            <HStack w="100%">
              <InputGroup
                w="100%"
                endElement={
                  <Text fontSize="12px" color="red.500">
                    {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
                  </Text>
                }>
                <Input value={codeInput} onChange={e => setCodeInput(e.target.value)} placeholder="인증번호 입력" />
              </InputGroup>
              <Button onClick={verify} colorPalette="teal">
                확인
              </Button>
            </HStack>
          </FormField>
        )}

        <FormField
          label="닉네임"
          isRequired
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          onBlur={() => setErrors(prev => ({ ...prev, nickname: validateNickname(nickname) }))}
          placeholder="12자 이내의 닉네임"
          maxLength={12}
          error={errors.nickname}
        />

        <FormField label="비밀번호" isRequired error={errors.password}>
          <PasswordInput
            placeholder="영문, 숫자, 특수문자 포함 8자리 이상"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onBlur={() => setErrors(prev => ({ ...prev, password: validatePassword(password) }))}
          />
        </FormField>

        <FormField label="비밀번호 확인" isRequired error={errors.passwordConfirm}>
          <PasswordInput
            placeholder="비밀번호 재입력"
            value={passwordConfirm}
            onChange={e => setPasswordConfirm(e.target.value)}
            onBlur={() =>
              setErrors(prev => ({
                ...prev,
                passwordConfirm: validatePasswordConfirm(password, passwordConfirm),
              }))
            }
          />
        </FormField>

        <Button colorPalette="teal" size="lg" mt={4} onClick={handleSubmit}>
          다음
        </Button>

        <Text fontSize="sm" textAlign="center" color="gray.500" mt={4}>
          이미 계정이 있으신가요?{' '}
          <Link color="teal.600" onClick={() => router.push('/login')}>
            로그인
          </Link>
        </Text>
      </VStack>
      <Toaster />
    </Box>
  );
}

export default SignUpRegister;
