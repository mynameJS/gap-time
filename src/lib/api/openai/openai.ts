import { fetchTopPlaceByKeyword } from '@/lib/api/google/places';

export async function getRecommendedPlacesByPrompt(prompt: string, lat: number, lng: number) {
  try {
    const res = await fetch('/api/ai-recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const { result: keywords }: { result: string[] } = await res.json();

    const placePromises = keywords.map(keyword =>
      fetchTopPlaceByKeyword({
        latitude: lat,
        longitude: lng,
        keyword,
        sortBy: 'distance',
      }),
    );

    const results = await Promise.all(placePromises);
    return results.filter(Boolean);
  } catch (error) {
    console.error('🛑 클라이언트 추천 장소 처리 실패:', error);
    return [];
  }
}
