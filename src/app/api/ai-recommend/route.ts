import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY not found');
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    const SYSTEM_PROMPT = `
    너는 사용자의 요청을 바탕으로 장소 검색에 활용할 수 있는 키워드 3개를 추출하는 어시스턴트야.

    - 사용자의 입력이 **구체적인 장소명**일 경우, 해당 장소명을 그대로 첫 번째 키워드로 유지해.
    - 나머지 키워드는 그 장소와 유사한 분위기나 유형으로 제안해도 좋아.
    - 장소명이 아닌 **분위기나 목적** 위주의 요청일 경우에는, 기존처럼 분위기/유형 중심 키워드를 추천해.
    - 예: 
      - "롯데월드 가고싶어" → "롯데월드, 실내 놀이공원, 복합 문화공간"
      - "혼자 조용히 있고 싶어" → "조용한 카페, 북카페, 작은 공원"
      - "감성적인 데이트 장소" → "감성 레스토랑, 루프탑 바, 야경 좋은 장소"

     출력 형식:
    - 쉼표(,)로 구분된 하나의 줄로만 출력해.
    - 줄바꿈 없이 키워드만 출력해. 설명은 절대 하지 마.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content ?? '';

    const keywords = content
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0)
      .slice(0, 3);

    return NextResponse.json({ result: keywords });
  } catch (error) {
    console.error('❌ GPT 키워드 추출 실패:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
