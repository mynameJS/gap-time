'use client';

import { useState } from 'react';
import { Button, VStack, Text, Box, Icon } from '@chakra-ui/react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import getCurrentLocationAddress from '@/utils/getCurrentLocationAddress';
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

  // const getLocation = () => {
  //   if (navigator.geolocation) {
  //     setLoading(true);
  //     navigator.geolocation.getCurrentPosition(
  //       async position => {
  //         const { latitude, longitude } = position.coords;
  //         onUpdate({ geocode: { lat: latitude, lng: longitude } });
  //         try {
  //           const address = await fetchAddress({ latitude, longitude });
  //           if (address) {
  //             onUpdate({ formattedAddress: address[0].formatted_address });
  //             setError('');
  //           } else {
  //             setError('주소를 찾을 수 없습니다.');
  //           }
  //         } catch (fetchError) {
  //           setError('주소 정보를 가져오는 중 오류가 발생했습니다.');
  //           console.error(fetchError);
  //         }
  //         setLoading(false);
  //       },
  //       err => {
  //         setLoading(false);
  //         if (err.code === 1) {
  //           setError('위치 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
  //         } else {
  //           setError('위치 정보를 가져오는 중 오류가 발생했습니다.');
  //         }
  //       }
  //     );
  //   } else {
  //     setError('Geolocation API를 지원하지 않는 브라우저입니다.');
  //   }
  // };

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
