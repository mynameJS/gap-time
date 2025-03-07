import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { latitude, longitude } = await req.json();

    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key is missing' }, { status: 500 });
    }

    const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=ko&key=${apiKey}`;

    const response = await fetch(googleMapsUrl);
    const data = await response.json();

    if (data.status !== 'OK') {
      return NextResponse.json({ error: 'Error fetching address', details: data }, { status: 500 });
    }

    return NextResponse.json(data.results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch address', details: error }, { status: 500 });
  }
}
