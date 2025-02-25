'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

function KakaoMap() {
  const apiKey: string | undefined = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  console.log(apiKey);
  useEffect(() => {
    const script: HTMLScriptElement = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    document.head.appendChild(script);

    script.addEventListener('load', () => {
      window.kakao.maps.load(() => {
        // 결과값 위치 좌표
        const coords = new window.kakao.maps.LatLng(37.5665, 126.978);
        // 지도를 담을 영역의 DOM 레퍼런스
        const container = document.getElementById('map');

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        const options = {
          // 지도를 생성할 때 필요한 기본 옵션
          center: coords, // 지도의 중심좌표
          level: 3, // 지도의 레벨(확대, 축소 정도)
        };
        const map = new window.kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

        map.setCenter(coords);
      });
    });
  }, []);

  return <div id="map" style={{ height: '500px', width: '100%' }} />;
}

export default KakaoMap;
