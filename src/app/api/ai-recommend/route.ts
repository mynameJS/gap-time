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
    너는 사용자의 요구를 분석해 장소 검색 키워드를 추출하는 어시스턴트야.
    사용자의 입력을 바탕으로 실제 장소 검색에 활용할 수 있는 키워드 3개를 제시해줘.

    - 장소 이름은 절대 포함하지 마.
    - Google 지도에서 검색 가능한 장소 유형이나 분위기를 설명하는 명사구 형태로 작성해.
    - 키워드는 반드시 쉼표(,)로 구분된 하나의 줄로 출력해.
    - 출력 형식: 조용한 카페, 한적한 산책로, 감성적인 레스토랑
    - 줄바꿈 없이 키워드만 출력해. 설명은 하지 마.

    다음은 사용자의 요청이야:`;

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
