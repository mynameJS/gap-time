'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@/lib/api/firebase/auth';
import MyInfo from './MyInfo';
import MyPlanList from './MyPlanList';
import { Spinner, Center, Text } from '@chakra-ui/react';

function MyPageContent() {
  // ✅ uid 따로 저장
  const stored = sessionStorage.getItem('user');
  const uid = stored ? JSON.parse(stored).uid : null;

  // ✅ React Query로 유저 정보 불러오기
  const {
    data: userInfo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['userInfo', uid],
    queryFn: () => getUserInfo(uid),
    enabled: !!uid,
  });

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
