interface FetchDistanceMatrixParams {
  origin: google.maps.LatLngLiteral | string;
  destination: google.maps.LatLngLiteral | string;
  mode: string;
}

// 출발지와 도착지 사이의 거리와 시간을 가져오는 함수 (geocode or place_id)
export const fetchDistanceMatrix = async (params: FetchDistanceMatrixParams) => {
  try {
    const response = await fetch('/api/google-maps/distancematrix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch distance matrix');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch distance matrix:', error);
    return { error: 'Failed to fetch distance matrix' };
  }
};
