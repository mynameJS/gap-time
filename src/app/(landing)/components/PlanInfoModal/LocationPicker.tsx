'use client';

import { useState } from 'react';
import { Button, VStack, Text, Box, Icon } from '@chakra-ui/react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import getCurrentLocationAddress from '@/utils/location/getCurrentLocationAddress';
import { PlanInfo } from '@/types/interface';

interface LocationPickerProps {
  formattedAddress: string;
  onUpdate: (updates: Partial<PlanInfo>) => void;
}

export default function LocationPicker({ formattedAddress, onUpdate }: LocationPickerProps) {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 현재 위치 가져오기
  const handleGetLocation = async () => {
    setLoading(true);
    setError('');
    try {
      const { geocode, formattedAddress } = await getCurrentLocationAddress();
      onUpdate({ geocode, formattedAddress });
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    }
    setLoading(false);
  };

  return (
    <VStack gap={4} width="100%" p={4} bg="gray.50" borderRadius="lg" boxShadow="sm">
      {/* 현재 위치 가져오기 버튼 */}
      <Button
        onClick={handleGetLocation}
        colorPalette="blue"
        size="md"
        loading={loading} // ✅ 로딩 시 스피너 표시
        loadingText="위치 가져오는 중...">
        현재 위치 가져오기
      </Button>

      {/* 선택된 위치 표시 */}
      {formattedAddress && (
        <Box p={3} bg="white" borderRadius="md" boxShadow="md" display="flex" alignItems="center" gap={2}>
          <Icon as={FaMapMarkerAlt} color="red.400" />
          <Text fontSize="md" fontWeight="bold" color="gray.700">
            {formattedAddress}
          </Text>
        </Box>
      )}

      {/* 에러 메시지 */}
      {error && (
        <Text mt={4} color="red.500" fontSize="sm" fontWeight="bold">
          {error}
        </Text>
      )}
    </VStack>
  );
}
