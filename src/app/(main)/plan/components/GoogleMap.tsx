'use client';
import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Box, Spinner } from '@chakra-ui/react';
import { fetchNearbyPlaces } from '@/lib/api/places';

// 타입 정의
const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

const defaultCenter: google.maps.LatLngLiteral = {
  lat: 37.5665, // 서울 위도
  lng: 126.978, // 서울 경도
};

const mapOptions: google.maps.MapOptions = {
  zoomControl: false, // 줌 버튼 비활성화
  mapTypeControl: false, // 지도/위성 전환 버튼 비활성화
  streetViewControl: false, // 로드뷰 버튼 비활성화
  cameraControl: false, // 카메라 각도 조절 버튼 비활성화
};

function GoogleMaps() {
  const [map, setMap] = useState<google.maps.Map | null>(null); // 맵 객체 타입 정의
  // 추후 마커나 마우스무브, 세부페이지 이동 시에 사용예정
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral>(defaultCenter);

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

  // useEffect(() => {
  //   if (map) {
  //     // ✅ 주변 장소 가져오기
  //     fetchNearbyPlaces({ latitude: currentLocation.lat, longitude: currentLocation.lng, radius: 1000 }).then(
  //       places => {
  //         if (places) {
  //           console.log(places);
  //         }
  //       }
  //     );
  //   }
  // }, [map, currentLocation]);

  return (
    <Box w="100%" h="100%" position="relative" borderRadius="lg" overflow="hidden" boxShadow="lg">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!} loadingElement={<Spinner />}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentLocation}
          zoom={16}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}
        />
      </LoadScript>
    </Box>
  );
}

export default GoogleMaps;
