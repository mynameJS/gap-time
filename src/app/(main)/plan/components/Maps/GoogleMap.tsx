'use client';
import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, OverlayView } from '@react-google-maps/api';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import useCurrentLocationStore from '@/store/useCurrentLocationStore';
import useGeocodeListStore from '@/store/useGeocodeListStore';

// 타입 정의
const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

const mapOptions: google.maps.MapOptions = {
  zoomControl: false, // 줌 버튼 비활성화
  mapTypeControl: false, // 지도/위성 전환 버튼 비활성화
  streetViewControl: false, // 로드뷰 버튼 비활성화
  cameraControl: false, // 카메라 각도 조절 버튼 비활성화
};

function GoogleMaps() {
  // 추후 마커나 마우스무브, 세부페이지 이동 시에 사용예정
  const [map, setMap] = useState<google.maps.Map | null>(null); // 맵 객체 타입 정의
  const { currentLocation, setCurrentLocation } = useCurrentLocationStore();
  const { geocodeList } = useGeocodeListStore();

  // onLoad 콜백
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map); // 맵 객체 상태에 저장
  }, []);

  // onUnmount 콜백
  const onUnmount = useCallback(() => {
    setMap(null); // 맵 객체 초기화
  }, []);

  // ✅ 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        error => console.error(error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <Box w="100%" h="100%" position="relative" borderRadius="lg" overflow="hidden" boxShadow="lg">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!} loadingElement={<Spinner />}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentLocation}
          zoom={16}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}>
          {/* <Marker position={currentLocation} label={'현재 위치'} /> */}
          <OverlayView position={currentLocation} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
            <VStack align="center">
              <Text
                fontSize="xs"
                color="gray.700"
                bg="white"
                py={1}
                borderRadius="md"
                boxShadow="sm"
                w="50px"
                textAlign={'center'}>
                현재 위치
              </Text>
              <Box w="30px" h="30px" borderRadius="full" bg="blue.500" border="2px solid white" boxShadow="md" />
            </VStack>
          </OverlayView>
          {geocodeList.map((item, index) => (
            <OverlayView key={item.place_id} position={item.geocode} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
              <Box
                bg="red.500"
                color="white"
                borderRadius="full"
                w="32px"
                h="32px"
                textAlign="center"
                lineHeight="30px"
                fontWeight="bold"
                fontSize="sm"
                border="2px solid white"
                boxShadow="md">
                {index + 1}
              </Box>
            </OverlayView>
          ))}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
}

export default GoogleMaps;
