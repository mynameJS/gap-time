interface NearbyPlacesParams {
  latitude: number;
  longitude: number;
  radius?: number;
  type: string;
  sortBy?: string;
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
    } else if (params.sortBy === 'reviews') {
      places.sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0));
    }

    return places;
  } catch (error) {
    console.error('Error fetching places:', error);
    return null;
  }
};

const testParams = {
  latitude: 37.5662952,
  longitude: 126.9779451,
  radius: 10000,
  type: 'amusement_park',
};

fetchNearbyPlaces(testParams).then(console.log);

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
