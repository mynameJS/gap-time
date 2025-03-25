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

    const places = await response.json();

    if (params.sortBy === 'rating') {
      places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      // distance 로 검색할 시 reviews 많은 순으로 정렬(임시)
    } else if (params.sortBy === 'distance') {
      places.sort((a, b) => (b.total_reviews || 0) - (a.total_reviews || 0));
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

    // ✅ 사진 URL 변환
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
    // 1. 주변 장소 가져오기
    const response = await fetch('/api/google-maps/places/nearby', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) throw new Error('Failed to fetch nearby places');

    const rawPlaces = await response.json();

    // 2. 사진 URL 및 상세정보를 순차적으로 추가
    const enrichedPlaces = await Promise.all(
      rawPlaces.map(async (place: any) => {
        let photo_url = null;
        let detail = {};

        // (1) 사진 URL 변환
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

        // (2) 상세 정보 병합
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
      })
    );

    // 3. 정렬 조건 적용
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

// nearby
//       place_id: place.place_id,
//       name: place.name,
//       photo_reference: place.photos?.[0]?.photo_reference || null,
//       rating: place.rating,
//       total_reviews: place.user_ratings_total,
//       type: place.types[0],
//       icon: [place.icon, place.icon_background_color],
//       vicinity: place.vicinity,
//       geocode: place.geometry.location,

// detail

// name: placeData.name,
// address: placeData.formatted_address,
// open_hours: placeData.opening_hours ?? null,
// rating: placeData.rating ?? null,
// total_reviews: placeData.user_ratings_total ?? 0,
// url: placeData.url ?? null,
// photoReference: placeData.photos?.length ? placeData.photos[0].photo_reference : null,
// icon: placeData.icon ? [placeData.icon, placeData.icon_background_color] : null,
// phone_number: placeData.formatted_phone_number ?? null,
// website: placeData.website ?? null,
// summary: placeData.editorial_summary?.overview ?? null,

// place_id: string;
// name: string;
// photo_reference?: string;
// rating: number;
// total_reviews: number;
// type: string;
// icon: [string, string];
// vicinity: string;
// photo_url: string;
// geocode: google.maps.LatLngLiteral;

// i want

// place_id -> nearby
// name -> near
// address -> detail
// open_hours -> detail
// rating -> near
// total_reviews -> near
// photo_url -> photo
// icon -> near
// geocode -> near
// type -> near
// url -> detail
// phone_number -> detail
// website -> detail
// summary -> detail
