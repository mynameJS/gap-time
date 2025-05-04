import { NextResponse } from 'next/server';

type DistanceMatrixRequest = {
  origin: google.maps.LatLngLiteral | string;
  destination: google.maps.LatLngLiteral | string;
  mode: string;
};

export async function POST(req: Request) {
  try {
    const { origin, destination, mode }: DistanceMatrixRequest = await req.json();

    if (!origin || !destination || !mode) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key is missing' }, { status: 500 });
    }

    const formattedOrigins = typeof origin === 'string' ? `place_id:${origin}` : `${origin.lat},${origin.lng}`;
    const formattedDestinations =
      typeof destination === 'string' ? `place_id:${destination}` : `${destination.lat},${destination.lng}`;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${formattedOrigins}&destinations=${formattedDestinations}&mode=${mode}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return NextResponse.json({ error: 'Error fetching distance matrix', details: data }, { status: 500 });
    }

    return NextResponse.json(data.rows[0].elements[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch distance matrix', details: error }, { status: 500 });
  }
}
