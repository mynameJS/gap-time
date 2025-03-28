import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { GoogleAuth } from 'google-auth-library';

export async function GET() {
  try {
    const keyPath = path.join(process.cwd(), 'src/keys/google-service-account.json');
    const keyFile = fs.readFileSync(keyPath, 'utf-8');
    const credentials = JSON.parse(keyFile);

    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/maps-platform.routes'],
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    return NextResponse.json({ success: true, token });
  } catch (err) {
    console.error('🔥 accessToken 발급 실패:', err);
    return NextResponse.json({ success: false, error: (err as any).message, stack: err }, { status: 500 });
  }
}
