import { NextRequest, NextResponse } from 'next/server';
import { getGPT3PlaceSuggestion } from '@/lib/api/openai/openai';

export async function POST(req: NextRequest) {
  try {
    const { location, timeLimit, mood } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY not found');
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const prompt = `
      현재 위치는 ${location}이고, 남은 시간은 ${timeLimit}분입니다.
      "${mood}" 같은 분위기의 장소를 추천해주세요. 하나만 간단히.
    `;

    const suggestion = await getGPT3PlaceSuggestion(apiKey, prompt);

    return NextResponse.json({ result: suggestion });
  } catch (error) {
    console.error('❌ GPT API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
