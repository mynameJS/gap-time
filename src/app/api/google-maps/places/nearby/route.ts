import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { latitude, longitude, type, radius, sortBy, keyword } = await req.json();

    // 위도, 경도 필수 체크
    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Missing required parameters: latitude and longitude' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key is missing' }, { status: 500 });
    }

    // 기본 URL 생성
    let googleMapsUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&language=ko&key=${apiKey}`;

    // ✅ 정렬 기준 설정 (기본값: prominence)
    if (sortBy === 'distance') {
      googleMapsUrl += `&rankby=distance`;
    } else {
      googleMapsUrl += `&rankby=prominence`;
      if (radius) {
        googleMapsUrl += `&radius=${radius}`; // prominence일 때만 radius 적용
      }
    }

    // ✅ type이 있을 경우 적용
    if (type) {
      googleMapsUrl += `&type=${type}`;
    }

    // ✅ keyword가 있을 경우 추가 (type과 함께 사용 가능)
    if (keyword) {
      googleMapsUrl += `&keyword=${encodeURIComponent(keyword)}`;
    }

    // API 요청
    const response = await fetch(googleMapsUrl);
    const data = await response.json();
    console.log(data);

    // 오류 처리
    if (data.status !== 'OK') {
      return NextResponse.json({ error: 'Error fetching places', details: data }, { status: 500 });
    }

    return NextResponse.json(data.results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch places', details: error }, { status: 500 });
  }
}
