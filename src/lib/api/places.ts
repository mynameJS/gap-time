interface NearbyPlacesParams {
  latitude: number;
  longitude: number;
  radius: number;
}

// 위도,경도, 반경을 받아서 주변 장소를 가져오는 함수
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

    return await response.json();
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
