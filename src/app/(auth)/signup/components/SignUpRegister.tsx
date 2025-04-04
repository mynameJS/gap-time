'use client';

import { Box, Button, Input, Text, VStack, HStack, Field, Link, Icon, Spinner } from '@chakra-ui/react';
import { InputGroup } from '@/components/ui/input-group';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toaster } from '@/components/ui/toaster';
import { IoMdEye, IoIosEyeOff } from 'react-icons/io';
import { sendVerificationCode } from '@/lib/api/firebase/auth';
import { registerUser } from '@/lib/api/firebase/auth';
import generate6DigitCode from '@/utils/generate6DigitCode';
import {
  validateEmail,
  validateNickname,
  validatePassword,
  validatePasswordConfirm,
} from '@/utils/validation/signupValidation';

type EmailStatus = 'idle' | 'pending' | 'sent';

function SignUpRegister() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [codeSentAt, setCodeSentAt] = useState<Date | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle');

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
  });

  const router = useRouter();

  const handleValidation = {
    email: () => setErrors(prev => ({ ...prev, email: validateEmail(email) })),
    nickname: () => setErrors(prev => ({ ...prev, nickname: validateNickname(nickname) })),
    password: () => setErrors(prev => ({ ...prev, password: validatePassword(password) })),
    passwordConfirm: () =>
      setErrors(prev => ({
        ...prev,
        passwordConfirm: validatePasswordConfirm(password, passwordConfirm),
      })),
  };

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

  const handleSendVerificationCode = async () => {
    const emailError = validateEmail(email);
    setErrors(prev => ({ ...prev, email: emailError }));
    if (emailError) return;

    const code = generate6DigitCode();
    setGeneratedCode(code);
    setCodeSentAt(new Date());
    setRemainingSeconds(300);
    setEmailStatus('pending');

    try {
      await sendVerificationCode(email, code);
      toaster.create({ description: '입력하신 이메일로 인증번호가 전송되었습니다.', type: 'success' });
      setEmailStatus('sent');
    } catch (error: any) {
      toaster.create({ description: error.message || '이메일 전송에 실패했습니다.', type: 'error' });
      setEmailStatus('idle');
    }
  };

  const handleVerifyCode = () => {
    if (!codeSentAt || (new Date().getTime() - codeSentAt.getTime()) / 1000 > 300) {
      toaster.create({ description: '인증번호 유효시간이 만료되었습니다. 다시 요청해주세요.', type: 'warning' });
      return;
    }
    if (verificationCode === generatedCode) {
      setIsVerified(true);
      toaster.create({ description: '이메일 인증이 완료되었습니다.', type: 'success' });
    } else {
      toaster.create({ description: '인증번호가 올바르지 않습니다.', type: 'error' });
    }
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
      toaster.create({ description: error.message || '회원가입 실패', type: 'error' });
    }
  };

  useEffect(() => {
    if (remainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setRemainingSeconds(prev => prev - 1);
    }, 1000);
    if (isVerified) clearInterval(timer);
    return () => clearInterval(timer);
  }, [remainingSeconds, isVerified]);

  return (
    <Box w="100%" maxW="500px" mx="auto" mt="10" p="8" borderWidth={1} borderRadius="xl" boxShadow="md" bg="white">
      <VStack gap={5} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" color="teal" textAlign="center">
          회원가입
        </Text>

        {/* 이메일 */}
        <Field.Root required>
          <HStack align="start" w="100%">
            <Box flex="1">
              <Field.Label>
                이메일 <Field.RequiredIndicator />
              </Field.Label>
              <Input
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={handleValidation.email}
                disabled={isVerified}
              />
              <Box minH="10px" mt={1}>
                {errors.email && (
                  <Text fontSize="12px" color="red.500">
                    {errors.email}
                  </Text>
                )}
              </Box>
            </Box>
            <Button
              mt={5}
              variant="solid"
              colorPalette="teal"
              px={5}
              onClick={handleSendVerificationCode}
              disabled={isVerified || emailStatus === 'pending'}>
              {isVerified ? '완료' : emailStatus === 'pending' ? <Spinner size="sm" /> : '인증'}
            </Button>
          </HStack>
        </Field.Root>

        {/* 인증번호 */}
        {!isVerified && emailStatus === 'sent' && (
          <Field.Root required>
            <Field.Label>인증번호</Field.Label>
            <HStack w="100%">
              <InputGroup
                w="100%"
                endElement={
                  <Text fontSize="12px" color="red">
                    {Math.floor(remainingSeconds / 60)}:{String(remainingSeconds % 60).padStart(2, '0')}
                  </Text>
                }>
                <Input
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                  placeholder="인증번호 입력"
                />
              </InputGroup>
              <Button colorPalette="teal" onClick={handleVerifyCode} px={5}>
                확인
              </Button>
            </HStack>
          </Field.Root>
        )}

        {/* 닉네임 */}
        <Field.Root required>
          <Field.Label>
            닉네임 <Field.RequiredIndicator />
          </Field.Label>
          <InputGroup
            w="100%"
            endElement={
              <Text fontSize="12px" color="gray.500">
                {nickname.length} / 12
              </Text>
            }>
            <Input
              placeholder="12자 이내의 닉네임을 입력해주세요."
              value={nickname}
              maxLength={12}
              onChange={e => setNickname(e.target.value.slice(0, 12))}
              onBlur={handleValidation.nickname}
            />
          </InputGroup>
          {errors.nickname && (
            <Text fontSize="12px" color="red.500" mt={1}>
              {errors.nickname}
            </Text>
          )}
        </Field.Root>

        {/* 비밀번호 */}
        <Field.Root required>
          <Field.Label>
            비밀번호 <Field.RequiredIndicator />
          </Field.Label>
          <InputGroup
            w="100%"
            endElement={
              <Button
                h="1.75rem"
                size="sm"
                variant="ghost"
                minW="auto"
                p={0}
                onClick={() => setShowPw(prev => !prev)}
                aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}>
                <Icon as={showPw ? IoIosEyeOff : IoMdEye} boxSize={5} />
              </Button>
            }>
            <Input
              type={showPw ? 'text' : 'password'}
              placeholder="영문, 숫자, 특수문자 포함 8자리 이상"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onBlur={handleValidation.password}
            />
          </InputGroup>
          {errors.password && (
            <Text fontSize="12px" color="red.500" mt={1}>
              {errors.password}
            </Text>
          )}
        </Field.Root>

        {/* 비밀번호 확인 */}
        <Field.Root required>
          <Field.Label>
            비밀번호 확인 <Field.RequiredIndicator />
          </Field.Label>
          <InputGroup
            w="100%"
            endElement={
              <Button
                h="1.75rem"
                size="sm"
                variant="ghost"
                minW="auto"
                p={0}
                onClick={() => setShowPw(prev => !prev)}
                aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}>
                <Icon as={showPw ? IoIosEyeOff : IoMdEye} boxSize={5} />
              </Button>
            }>
            <Input
              type={showPw ? 'text' : 'password'}
              placeholder="비밀번호 재입력"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              onBlur={handleValidation.passwordConfirm}
            />
          </InputGroup>
          {errors.passwordConfirm && (
            <Text fontSize="12px" color="red.500" mt={1}>
              {errors.passwordConfirm}
            </Text>
          )}
        </Field.Root>

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
