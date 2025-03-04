'use client';

import { useState } from 'react';
import { Button, VStack, Text } from '@chakra-ui/react';
import { fetchAddress } from '@/lib/api/places';

export default function LocationPicker() {
  const [location, setLocation] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 현재 위치 가져오기
  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true); // 로딩 상태로 설정
      navigator.geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          const params = { latitude, longitude };
          console.log(params);
          const address = await fetchAddress(params); // fetchAddress 함수 호출
          console.log(address);
          if (address) {
            setLocation(address[4].formatted_address); // 받아온 주소 설정
          } else {
            setError('주소를 찾을 수 없습니다.');
          }
          setLoading(false); // 로딩 완료
        },
        err => {
          setLoading(false); // 로딩 완료
          setError('위치 정보를 가져올 수 없습니다.');
        }
      );
    } else {
      setError('Geolocation API를 지원하지 않는 브라우저입니다.');
    }
  };

  return (
    <VStack gap={4} width="100%">
      <Button onClick={getLocation} colorScheme="blue" loading={loading}>
        현재 위치 가져오기
      </Button>

      {/* 위치 정보 또는 에러 메시지 */}
      {location && (
        <Text mt={4}>
          현재 위치: <strong>{location}</strong>
        </Text>
      )}

      {error && (
        <Text mt={4} color="red.500">
          {error}
        </Text>
      )}
    </VStack>
  );
}
