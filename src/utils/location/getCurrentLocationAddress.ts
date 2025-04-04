import { fetchAddress } from '@/lib/api/google/places';

interface LocationResult {
  geocode: { lat: number; lng: number };
  formattedAddress: string;
}

const getCurrentLocationAddress = (): Promise<LocationResult> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation API를 지원하지 않는 브라우저입니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        try {
          const address = await fetchAddress({ latitude, longitude });
          if (address && address[0]) {
            resolve({
              geocode: { lat: latitude, lng: longitude },
              formattedAddress: address[0].formatted_address,
            });
          } else {
            reject(new Error('주소를 찾을 수 없습니다.'));
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            reject(new Error(`주소 정보를 가져오는 중 오류가 발생했습니다: ${error.message}`));
          } else {
            reject(new Error('주소 정보를 가져오는 중 알 수 없는 오류가 발생했습니다.'));
          }
        }
      },
      (err: GeolocationPositionError) => {
        console.error('Geolocation error:', err);
        switch (err.code) {
          case 1:
            reject(new Error('위치 권한이 거부되었습니다.'));
            break;
          case 2:
            reject(new Error('위치 정보를 사용할 수 없습니다 (POSITION_UNAVAILABLE).'));
            break;
          case 3:
            reject(new Error('위치 정보 요청이 시간 초과되었습니다.'));
            break;
          default:
            reject(new Error('알 수 없는 위치 오류가 발생했습니다.'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export default getCurrentLocationAddress;
