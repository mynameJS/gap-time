import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { placeId } = await req.json();

    if (!placeId) {
      return NextResponse.json({ error: 'Missing placeId' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key is missing' }, { status: 500 });
    }

    // ✅ Google Places Details API 요청 URL (모든 fields 포함)
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_component,adr_address,formatted_address,geometry,icon,icon_mask_base_uri,icon_background_color,name,permanently_closed,photo,place_id,plus_code,type,url,utc_offset,vicinity,wheelchair_accessible_entrance,opening_hours,curbside_pickup,delivery,dine_in,editorial_summary,formatted_phone_number,international_phone_number,website,price_level,rating,reservable,reviews,serves_beer,serves_breakfast,serves_brunch,serves_dinner,serves_lunch,serves_vegetarian_food,serves_wine,takeout,user_ratings_total&language=ko&key=${apiKey}`;

    const response = await fetch(detailsUrl);
    const data = await response.json();

    if (data.status !== 'OK') {
      return NextResponse.json({ error: 'Error fetching place details', details: data }, { status: 500 });
    }

    const placeData = data.result;

    return NextResponse.json({
      place_id: placeData.place_id,
      name: placeData.name,
      address: placeData.formatted_address,
      open_hours: placeData.opening_hours ?? null,
      rating: placeData.rating ?? null,
      total_reviews: placeData.user_ratings_total ?? 0,
      url: placeData.url ?? null,
      photo_reference: placeData.photos?.length ? placeData.photos[0].photo_reference : null,
      icon: placeData.icon ? [placeData.icon, placeData.icon_background_color] : null,
      phone_number: placeData.formatted_phone_number ?? null,
      website: placeData.website ?? null,
      summary: placeData.editorial_summary?.overview ?? null,
      geocode: placeData.geometry.location ?? null,
      type: placeData.types[0] ?? null,
      vicinity: placeData.vicinity,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch place details', details: error }, { status: 500 });
  }
}
