'use client';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import { GoogleMap, OverlayView, Polygon, LoadScriptNext } from '@react-google-maps/api';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import useGeocodeListStore from '@/store/useGeocodeListStore';
import usePlanStore from '@/store/usePlanInfoStore';
import usePolylineListStore from '@/store/usePolylineListStore';
import decodePolyline from '@/utils/format/decodePolyline';
import getConvexHull from '@/utils/format/getConvexHull';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

const mapOptions: google.maps.MapOptions = {
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  cameraControl: false,
};

function GoogleMaps() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { planInfo } = usePlanStore();
  const { geocodeList } = useGeocodeListStore();
  const { polylineList } = usePolylineListStore();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  const polylineObjectsRef = useRef<google.maps.Polyline[]>([]);
  const calculatedPolygon = geocodeList.map(item => item.geocode);

  useEffect(() => {
    if (!map) return;

    polylineObjectsRef.current.forEach(p => p.setMap(null));
    polylineObjectsRef.current = [];

    if (mode === 'result' && polylineList.length > 0) {
      const newPolylines: google.maps.Polyline[] = [];

      polylineList.forEach(step => {
        const path = decodePolyline(step.polyline);

        const isWalk = step.travelMode === 'WALK';

        const polyline = new google.maps.Polyline({
          path,
          map,
          strokeColor: isWalk ? '#FF6347' : '#4285F4',
          strokeOpacity: isWalk ? 0 : 1,
          strokeWeight: 5,
          icons: isWalk
            ? [
                {
                  icon: {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 1,
                    scale: 4,
                  },
                  offset: '0',
                  repeat: '15px',
                },
              ]
            : undefined,
        });

        newPolylines.push(polyline);
      });

      polylineObjectsRef.current = newPolylines;
    }
  }, [map, polylineList, mode]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (!map || geocodeList.length === 0) return;

    const latestLocation = geocodeList[geocodeList.length - 1].geocode;
    map.panTo(latestLocation);
  }, [geocodeList, map]);

  if (!planInfo) return null;

  return (
    <Box w="100%" h={{ base: '30%', md: '100%' }} position="relative">
      <LoadScriptNext googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!} loadingElement={<Spinner />}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={planInfo?.geocode}
          zoom={15}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}>
          {/* 현재 위치 */}
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
                textAlign="center">
                현재 위치
              </Text>
              <Box w="30px" h="30px" borderRadius="full" bg="blue.500" border="2px solid white" boxShadow="md" />
            </VStack>
          </OverlayView>

          {/* 방문 마커 */}
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

          {/* Polygon (선택 모드) */}
          {mode === 'select' && calculatedPolygon.length > 0 && (
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
          )}
        </GoogleMap>
      </LoadScriptNext>
    </Box>
  );
}

export default GoogleMaps;
