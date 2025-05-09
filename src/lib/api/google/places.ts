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

    if (!response.ok) throw new Error('Failed to fetch places');

    const places = await response.json();

    if (params.sortBy === 'rating') {
      places.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
    } else if (params.sortBy === 'distance' && !params.keyword) {
      places.sort((a: any, b: any) => (b.total_reviews || 0) - (a.total_reviews || 0));
    }

    return places;
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
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

// 기존 details 함수 + photo url 추가 후 리턴
export const fetchPlaceDetailsWithPhoto = async (placeId: string) => {
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

    const detail = await response.json();

    let photo_url = null;
    if (detail.photo_reference) {
      try {
        const photoRes = await fetch(`/api/google-maps/photo?photo_reference=${detail.photo_reference}`);
        if (photoRes.ok) {
          photo_url = photoRes.url;
        }
      } catch (err) {
        console.error(`Failed to fetch photo for place_id: ${placeId}`, err);
      }
    }

    return { ...detail, photo_url };
  } catch (error) {
    console.error('Error fetching Place Details:', error);
    return null;
  }
};

// nearby, photo, detail api를 이용하여 원하는 데이터 필터링 및 추출 함수
export const fetchNearbyPlacesDetail = async (params: NearbyPlacesParams) => {
  try {
    const response = await fetch('/api/google-maps/places/nearby', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) throw new Error('Failed to fetch nearby places');

    const rawPlaces = await response.json();

    const enrichedPlaces = await Promise.all(
      rawPlaces.map(async (place: any) => {
        let photo_url = null;
        let detail = {};

        if (place.photo_reference) {
          try {
            const photoRes = await fetch(`/api/google-maps/photo?photo_reference=${place.photo_reference}`);
            if (photoRes.ok) {
              photo_url = photoRes.url;
            }
          } catch (err) {
            console.error(`Failed to fetch photo for place_id: ${place.place_id}`, err);
          }
        }

        try {
          const detailData = await fetchPlaceDetails(place.place_id);
          detail = detailData ?? {};
        } catch (err) {
          console.error(`Failed to fetch details for place_id: ${place.place_id}`, err);
        }

        return {
          ...place,
          photo_url,
          ...detail,
        };
      }),
    );

    if (params.sortBy === 'rating') {
      enrichedPlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (params.sortBy === 'distance') {
      enrichedPlaces.sort((a, b) => (b.total_reviews || 0) - (a.total_reviews || 0));
    }

    return enrichedPlaces;
  } catch (error) {
    console.error('Error fetching nearby places detail:', error);
    return [];
  }
};

// 키워드 기반 검색, 각 키워드 별 최상위 장소 1곳만 페칭(detail, photo_url ..)
export const fetchTopPlaceByKeyword = async (params: NearbyPlacesParams) => {
  try {
    const response = await fetch('/api/google-maps/places/nearby', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) throw new Error('Failed to fetch nearby places');

    const places = await response.json();
    const topPlace = places[0];
    if (!topPlace) return null;

    const detail = await fetchPlaceDetails(topPlace.place_id);

    let photo_url = null;
    if (topPlace.photo_reference) {
      try {
        const photoRes = await fetch(`/api/google-maps/photo?photo_reference=${topPlace.photo_reference}`);
        if (photoRes.ok) {
          photo_url = photoRes.url;
        }
      } catch (err) {
        console.error(`Failed to fetch photo for place_id: ${topPlace.place_id}`, err);
      }
    }

    return {
      ...topPlace,
      ...detail,
      photo_url,
    };
  } catch (error) {
    console.error('❌ Error fetching top place by keyword:', error);
    return null;
  }
};
