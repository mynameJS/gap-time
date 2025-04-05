'use client';

import { useEffect, useState } from 'react';
import { Field, Input, Button, HStack, Box } from '@chakra-ui/react';
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogRoot } from '@/components/ui/dialog';
import { Toaster, toaster } from '@/components/ui/toaster';
import { updateUserNickname } from '@/lib/api/firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { UserInfo } from '@/types/interface';
import DeleteAccountModal from '../DeleteAccountModal';

interface MyInfoModalProps {
  isOpen: boolean;
  onToggle: () => void;
  userInfo: UserInfo; // { email, nickname, provider? }
}

function MyInfoModal({ isOpen, onToggle, userInfo }: MyInfoModalProps) {
  const [nickname, setNickname] = useState('');
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const uid = JSON.parse(sessionStorage.getItem('user') || '{}')?.uid;

  // ✅ 모달 열릴 때 닉네임 초기화
  useEffect(() => {
    if (isOpen && userInfo?.nickname) {
      setNickname(userInfo.nickname);
    }
  }, [isOpen, userInfo]);

  // ✅ 저장 버튼 클릭
  const handleSave = async () => {
    if (!uid) return;

    const result = await updateUserNickname(uid, nickname);

    if (result.success) {
      // 🔄 캐시 업데이트
      queryClient.setQueryData(['userInfo', uid], {
        ...userInfo,
        nickname,
      });

      queryClient.invalidateQueries({ queryKey: ['userInfo', uid] });

      // 🔄 세션스토리지 동기화
      sessionStorage.setItem('user', JSON.stringify({ ...userInfo, uid, nickname }));

      toaster.create({
        title: '저장 완료',
        description: '닉네임이 저장되었습니다.',
        type: 'success',
      });
      onToggle();
    } else {
      toaster.create({
        title: '오류 발생',
        description: result.message,
        type: 'error',
      });
    }
  };

  // ✅ 회원탈퇴 모달 열기
  const handleDeleteModalToggle = () => {
    setDeleteModalOpen(prev => !prev);
  };

  return (
    <>
      <DialogRoot open={isOpen} onEscapeKeyDown={onToggle}>
        <DialogContent
          w={{ base: '70%', md: '40%', xl: '30%' }}
          maxW="90vw"
          maxHeight="90vh"
          mx="auto"
          my="auto"
          borderRadius="xl"
          boxShadow="2xl"
          p={{ base: 6, md: 10 }}
          bg="white"
          overflow="auto">
          <DialogHeader>
            <DialogTitle fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" textAlign="center" mb={2}>
              내 정보
            </DialogTitle>
          </DialogHeader>

          <DialogBody p={0}>
            <Field.Root mb={6}>
              <Field.Label>
                닉네임 <Field.RequiredIndicator />
              </Field.Label>
              <Input value={nickname} onChange={e => setNickname(e.target.value)} />
            </Field.Root>

            <Field.Root mb={6}>
              <Field.Label>
                이메일 <Field.RequiredIndicator />
              </Field.Label>
              <Input value={userInfo.email} readOnly />
            </Field.Root>

            <Box textAlign="right">
              <Button colorPalette="red" onClick={handleDeleteModalToggle}>
                회원탈퇴
              </Button>
            </Box>
          </DialogBody>

          <DialogFooter mt={6} flexDirection="column">
            <HStack>
              <Button variant="outline" onClick={onToggle}>
                취소
              </Button>
              <Button colorPalette="teal" onClick={handleSave}>
                저장
              </Button>
            </HStack>
          </DialogFooter>
        </DialogContent>
        <Toaster />
      </DialogRoot>

      {/* 🔥 탈퇴 모달 - provider가 undefined인 경우를 대비해 기본값 처리 */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onToggle={handleDeleteModalToggle}
        email={userInfo.email}
        uid={uid}
        provider={userInfo.provider === 'google' ? 'google' : 'password'}
      />
    </>
  );
}

export default MyInfoModal;
