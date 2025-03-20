interface NearbyPlacesParams {
  latitude: number;
  longitude: number;
  radius?: number;
  type?: string;
  sortBy?: string;
  keyword?: string;
}

// 위도,경도, 반경, 타입, 정렬 매개변수를 받아서 장소를 가져오는 함수
export const fetchNearbyPlaces = async (params: NearbyPlacesParams) => {
  try {
    const response = await fetch('/api/google-maps/places/nearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch places');
    }

    let places = await response.json();

    // 반환된 장소 이미지 url 추가
    places = await Promise.all(
      places.map(async (place: any) => {
        if (place.photo_reference) {
          try {
            const photoResponse = await fetch(`/api/google-maps/photo?photo_reference=${place.photo_reference}`);
            if (photoResponse.ok) {
              return { ...place, photo_url: photoResponse.url };
            }
          } catch (error) {
            console.error('Error fetching photo URL:', error);
          }
        }
        return { ...place, photo_url: null };
      })
    );

    // distance 로 검색할 시 reviews 많은 순으로 정렬(임시)
    if (params.sortBy === 'rating') {
      places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (params.sortBy === 'distance') {
      places.sort((a, b) => (b.total_reviews || 0) - (a.total_reviews || 0));
    }

    return places;
  } catch (error) {
    console.error('Error fetching places:', error);
    return null;
  }
};

interface AddressParams {
  latitude: number;
  longitude: number;
}

// 위도,경도를 받아서 주소를 가져오는 함수
export const fetchAddress = async (params: AddressParams) => {
  try {
    const response = await fetch('/api/google-maps/places/address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Address');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Address:', error);
    return null;
  }
};

// place_id를 받아서 장소 세부정보를 가져오는 함수
export const fetchPlaceDetails = async (placeId: string) => {
  try {
    const response = await fetch('/api/google-maps/places/details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ placeId }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch Place Details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Place Details:', error);
    return null;
  }
};
