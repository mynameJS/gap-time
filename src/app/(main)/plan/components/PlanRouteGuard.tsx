'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import usePlanStore from '@/store/usePlanInfoStore';
import { usePlanUnloadGuard } from '@/hooks/usePlanUnloadGuard';
import usePreventPopStateLeave from '@/hooks/usePreventPopStateLeave';

export default function PlanRouteGuard() {
  const { planInfo } = usePlanStore();
  const router = useRouter();

  usePlanUnloadGuard();
  const { showLeaveDialog, confirmLeave, cancelLeave } = usePreventPopStateLeave();

  useEffect(() => {
    if (!planInfo) {
      router.replace('/');
    }
  }, [planInfo, router]);

  if (!showLeaveDialog) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      bg="blackAlpha.600"
      zIndex="9999"
      display="flex"
      justifyContent="center"
      alignItems="center">
      <VStack bg="white" p={6} borderRadius="lg" gap={4} w="300px" textAlign="center">
        <Text fontSize="md" fontWeight="bold" color="teal.700">
          페이지를 떠나시겠습니까?
        </Text>
        <Text fontSize="sm" color="gray.600">
          저장되지 않은 정보가 사라질 수 있습니다.
        </Text>
        <VStack w="100%" gap={2}>
          <Button w="100%" colorPalette="teal" onClick={confirmLeave}>
            떠나기
          </Button>
          <Button w="100%" variant="outline" onClick={cancelLeave}>
            머무르기
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
