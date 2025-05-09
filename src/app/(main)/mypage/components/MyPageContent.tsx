'use client';

import { Spinner, Center, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getUserInfo } from '@/lib/api/firebase/auth';
import MyInfo from './MyInfo';
import MyPlanList from './MyPlanList';

function MyPageContent() {
  const [uid, setUid] = useState<string | null>(null);

  
  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUid(parsed?.uid ?? null);
    }
  }, []);

  const {
    data: userInfo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['userInfo', uid],
    queryFn: () => getUserInfo(uid!),
    enabled: !!uid,
  });

  if (!uid) {
    return (
      <Center py="20">
        <Spinner size="lg" color="teal.500" />
      </Center>
    );
  }

  if (isLoading) {
    return (
      <Center py="20">
        <Spinner size="lg" color="teal.500" />
      </Center>
    );
  }

  if (isError || !userInfo) {
    return (
      <Center py="20">
        <Text color="red.500" fontSize="sm">
          유저 정보를 불러오는 데 실패했습니다.
        </Text>
      </Center>
    );
  }

  return (
    <>
      <MyInfo userInfo={userInfo} />
      <MyPlanList userId={uid} />
    </>
  );
}

export default MyPageContent;
