'use client';

import { useState } from 'react';
import { Button, VStack, Text } from '@chakra-ui/react';
import { fetchAddress } from '@/lib/api/places';
import { PlanInfo } from '@/types/interface';

interface LocationPickerProps {
  formattedAddress: string;
  onUpdate: (updates: Partial<PlanInfo>) => void;
}

export default function LocationPicker({ formattedAddress, onUpdate }: LocationPickerProps) {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 현재 위치 가져오기
  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          onUpdate({ geocode: { lat: latitude, lng: longitude } });
          try {
            const address = await fetchAddress({ latitude, longitude });
            if (address) {
              onUpdate({ formattedAddress: address[4].formatted_address });
              setError('');
            } else {
              setError('주소를 찾을 수 없습니다.');
            }
          } catch (fetchError) {
            setError('주소 정보를 가져오는 중 오류가 발생했습니다.');
          }
          setLoading(false);
        },
        err => {
          setLoading(false);
          if (err.code === 1) {
            setError('위치 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
          } else {
            setError('위치 정보를 가져오는 중 오류가 발생했습니다.');
          }
        }
      );
    } else {
      setError('Geolocation API를 지원하지 않는 브라우저입니다.');
    }
  };

  return (
    <VStack gap={4} width="100%">
      {/* 현재 위치 가져오기 버튼 */}
      <Button onClick={getLocation} colorScheme="blue" loading={loading}>
        현재 위치 가져오기
      </Button>

      {/* 선택된 위치 표시 */}
      {formattedAddress && (
        <Text mt={4}>
          현재 위치: <strong>{formattedAddress}</strong>
        </Text>
      )}

      {/* 에러 메시지 */}
      {error && (
        <Text mt={4} color="red.500">
          {error}
        </Text>
      )}
    </VStack>
  );
}
