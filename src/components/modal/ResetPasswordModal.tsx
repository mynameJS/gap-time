import { Button, Input, VStack, Text, HStack } from '@chakra-ui/react';
import { useState } from 'react';
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogRoot } from '@/components/ui/dialog';
import { Toaster, toaster } from '@/components/ui/toaster';
import { sendResetEmail } from '@/lib/api/firebase/auth';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onToggle: () => void;
}

function ResetPasswordModal({ isOpen, onToggle }: ResetPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      setMessage('이메일을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      await sendResetEmail(email);
      setMessage('비밀번호 재설정 이메일을 전송했습니다.');
      toaster.create({ description: '비밀번호 재설정 이메일을 전송하였습니다.', type: 'success' });
      onToggle();
    } catch (error: any) {
      setMessage('이메일 전송에 실패했습니다. 다시 확인해주세요.');
      toaster.create({ description: '올바른 이메일 형식이 아닙니다.', type: 'error' });
      console.error('이메일 전송 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogRoot open={isOpen} onEscapeKeyDown={onToggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle color="teal.500">비밀번호 재설정</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <VStack gap={3} align="stretch">
            <Input type="email" placeholder="이메일 주소 입력" value={email} onChange={e => setEmail(e.target.value)} />
            {message && (
              <Text fontSize="12px" color="red.600">
                {message}
              </Text>
            )}
          </VStack>
        </DialogBody>

        <DialogFooter>
          <HStack gap={3}>
            <Button variant="ghost" onClick={onToggle}>
              닫기
            </Button>
            <Button onClick={handleSendEmail} loading={isLoading} colorPalette="teal">
              전송
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
      <Toaster />
    </DialogRoot>
  );
}

export default ResetPasswordModal;
