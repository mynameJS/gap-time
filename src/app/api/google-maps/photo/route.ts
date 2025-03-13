import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const photoReference = searchParams.get('photo_reference');

    if (!photoReference) {
      return NextResponse.json({ error: 'Missing photo_reference' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiKey}`;

    return NextResponse.redirect(photoUrl);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 500 });
  }
}
