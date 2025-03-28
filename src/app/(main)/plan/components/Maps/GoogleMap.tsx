'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { GoogleMap, LoadScript, OverlayView, Polyline, Polygon } from '@react-google-maps/api';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import usePlanStore from '@/store/usePlanInfoStore';
import useGeocodeListStore from '@/store/useGeocodeListStore';
import getConvexHull from '@/utils/format/getConvexHull';
import usePolylineListStore from '@/store/usePolylineListStore';
import decodePolyline from '@/utils/format/decodePolyline';

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
  const { planInfo } = usePlanStore();
  const { geocodeList } = useGeocodeListStore();
  const { polylineList } = usePolylineListStore();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  const decodingPolylineList = polylineList.map(polyline => decodePolyline(polyline));

  // onLoad 콜백
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map); // 맵 객체 상태에 저장
  }, []);

  // onUnmount 콜백
  const onUnmount = useCallback(() => {
    setMap(null); // 맵 객체 초기화
  }, []);

  // 장소 클릭 시 해당 지역으로 부드럽게 이동 로직
  useEffect(() => {
    if (!map || geocodeList.length === 0) return;

    const latestLocation = geocodeList[geocodeList.length - 1].geocode;
    map.panTo(latestLocation); // 부드럽게 이동
  }, [geocodeList, map]);

  const calculatedPolygon = geocodeList.map(item => item.geocode);

  if (!planInfo) return null;

  return (
    <Box w="100%" h="100%" position="relative" borderRadius="lg" overflow="hidden" boxShadow="lg">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!} loadingElement={<Spinner />}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={planInfo?.geocode}
          zoom={14}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}>
          <OverlayView position={planInfo.geocode} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
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
          {mode === 'result' ? (
            decodingPolylineList.map((polyline, index) => (
              <Polyline
                key={index}
                path={polyline}
                options={{
                  strokeColor: '#4285F4',
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                }}
              />
            ))
          ) : mode === 'select' ? (
            <Polygon
              path={getConvexHull(calculatedPolygon)}
              options={{
                strokeColor: '#4285F4',
                strokeOpacity: 0.8,
                strokeWeight: 4,
                geodesic: true,
                fillOpacity: 0,
              }}
            />
          ) : null}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
}

export default GoogleMaps;
