import { useEffect, useState } from 'react';
import { toaster } from '@/components/ui/toaster';
import { sendVerificationCode } from '@/lib/api/firebase/auth';
import generate6DigitCode from '@/utils/generate6DigitCode';

type EmailStatus = 'idle' | 'pending' | 'sent';

export default function useEmailVerification() {
  const [email, setEmail] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle');

  const startTimer = () => {
    setSeconds(300);
    setIsActive(true);
  };

  const resetVerification = () => {
    setGeneratedCode('');
    setCodeInput('');
    setIsVerified(false);
    setIsActive(false);
    setSeconds(0);
    setEmailStatus('idle');
  };

  useEffect(() => {
    if (!isActive || seconds <= 0) return;
    const timer = setInterval(() => setSeconds(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isActive, seconds]);

  const sendCode = async () => {
    if (!email) return;
    const code = generate6DigitCode();
    setGeneratedCode(code);
    setCodeInput('');
    setIsVerified(false);
    setEmailStatus('pending');
    startTimer();

    try {
      await sendVerificationCode(email, code);
      toaster.create({ description: '입력하신 이메일로 인증번호가 전송되었습니다.', type: 'success' });
      setEmailStatus('sent');
    } catch (err: any) {
      toaster.create({ description: err.message || '이메일 전송에 실패했습니다.', type: 'error' });
      resetVerification();
    }
  };

  const verify = () => {
    if (seconds <= 0) {
      toaster.create({ description: '인증번호 유효시간이 만료되었습니다.', type: 'warning' });
      return false;
    }

    if (codeInput === generatedCode) {
      setIsVerified(true);
      toaster.create({ description: '이메일 인증이 완료되었습니다.', type: 'success' });
      return true;
    }

    toaster.create({ description: '인증번호가 올바르지 않습니다.', type: 'error' });
    return false;
  };

  return {
    email,
    setEmail,
    codeInput,
    setCodeInput,
    isVerified,
    emailStatus,
    seconds,
    isExpired: seconds <= 0,
    isActive,
    sendCode,
    verify,
    resetVerification,
  };
}
