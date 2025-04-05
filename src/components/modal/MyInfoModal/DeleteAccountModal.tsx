'use client';

import { useState } from 'react';
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Field, Input, Button, Text, VStack, HStack } from '@chakra-ui/react';
import { deleteUserAccount } from '@/lib/api/firebase/auth';
import { useRouter } from 'next/navigation';
import { Toaster, toaster } from '@/components/ui/toaster';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onToggle: () => void;
  email: string;
  uid: string;
  provider?: 'password' | 'google';
}

export default function DeleteAccountModal({
  isOpen,
  onToggle,
  email,
  uid,
  provider = 'password',
}: DeleteAccountModalProps) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    const result = await deleteUserAccount({ email, password, uid, provider });
    setIsDeleting(false);

    if (result.success) {
      toaster.create({
        title: '회원탈퇴 완료',
        description: '계정이 삭제되었습니다.',
        type: 'success',
      });
      router.replace('/');
    } else {
      toaster.create({
        title: '탈퇴 실패',
        description: result.message || '알 수 없는 오류가 발생했습니다.',
        type: 'error',
      });
    }
  };

  const isPasswordProvider = provider === 'password';

  return (
    <DialogRoot open={isOpen} onEscapeKeyDown={onToggle}>
      <DialogContent w={{ base: '90%', md: '420px' }} p={6} borderRadius="xl" bg="white" boxShadow="2xl">
        <DialogHeader>
          <DialogTitle fontSize="xl" fontWeight="bold" textAlign="center">
            회원탈퇴
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <VStack align="stretch" gap={4}>
            <Text fontSize="sm" color="gray.600">
              탈퇴를 위해 {isPasswordProvider ? '비밀번호를 입력해주세요.' : 'Google 인증이 필요합니다.'}
              <br />이 작업은 되돌릴 수 없습니다.
            </Text>

            {isPasswordProvider && (
              <Field.Root>
                <Field.Label>비밀번호</Field.Label>
                <Input
                  type="password"
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </Field.Root>
            )}
          </VStack>
        </DialogBody>

        <DialogFooter mt={6}>
          <HStack w="100%" justify="flex-end">
            <Button variant="outline" onClick={onToggle}>
              취소
            </Button>
            <Button
              colorPalette="red"
              onClick={handleDelete}
              loading={isDeleting}
              disabled={isPasswordProvider && password.length < 4}>
              탈퇴하기
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
      <Toaster />
    </DialogRoot>
  );
}
