import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const photoReference = searchParams.get('photo_reference');

    if (!photoReference) {
      return NextResponse.json({ error: 'Missing photo_reference' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiKey}`;

    // ✅ 서버에서 Google API로 직접 요청 후 이미지 바이너리 데이터 반환
    const response = await fetch(googlePhotoUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 500 });
    }

    // ✅ 이미지 데이터 그대로 클라이언트에 전달
    const blob = await response.blob();
    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400', // 1일 캐시 설정
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch photo', details: error }, { status: 500 });
  }
}
