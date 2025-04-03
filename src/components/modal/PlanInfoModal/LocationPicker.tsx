'use client';

import { useState } from 'react';
import { Flex, HStack, Button, VStack, Text, Box, Icon } from '@chakra-ui/react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import getCurrentLocationAddress from '@/utils/location/getCurrentLocationAddress';
import { PlanInfo } from '@/types/interface';

interface LocationPickerProps {
  formattedAddress: string;
  onUpdate: (updates: Partial<PlanInfo>) => void;
  isInvalid: boolean;
}

export default function LocationPicker({ formattedAddress, onUpdate, isInvalid }: LocationPickerProps) {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetLocation = async () => {
    setLoading(true);
    setError('');
    try {
      const { geocode, formattedAddress } = await getCurrentLocationAddress();
      onUpdate({ geocode, formattedAddress });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    }
    setLoading(false);
  };

  return (
    <Flex direction="column" gap={4}>
      {/* 타이틀 */}
      <HStack>
        <Icon as={FaMapMarkerAlt} color="teal.500" />
        <Text fontSize="md" fontWeight="bold">
          출발 위치 설정
        </Text>
        {isInvalid && (
          <Text fontSize="xs" color="red.400">
            (필수 항목입니다)
          </Text>
        )}
      </HStack>

      {/* 카드 */}
      <VStack gap={4} width="100%" p={6} bg="gray.50" borderRadius="xl" boxShadow="sm" align="center">
        {/* 현재 위치 버튼 */}
        <Button
          onClick={handleGetLocation}
          colorPalette="teal"
          w="10rem"
          size="md"
          loading={loading}
          loadingText="위치 가져오는 중..."
          borderRadius="md">
          현재 위치 가져오기
        </Button>

        {/* 선택된 위치 */}
        {formattedAddress && (
          <Box p={4} bg="white" borderRadius="md" boxShadow="md" display="flex" alignItems="center" gap={3}>
            <Icon as={FaMapMarkerAlt} color="teal.500" />
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              {formattedAddress}
            </Text>
          </Box>
        )}

        {/* 에러 메시지 */}
        {error && (
          <Text mt={2} color="red.500" fontSize="sm" fontWeight="medium">
            {error}
          </Text>
        )}
      </VStack>
    </Flex>
  );
}
