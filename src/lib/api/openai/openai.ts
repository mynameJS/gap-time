import OpenAI from 'openai';

export async function getGPT3PlaceSuggestion(apiKey: string, prompt: string) {
  try {
    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '너는 여행 장소 추천 비서야.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content ?? '추천 결과가 없습니다.';
  } catch (err) {
    console.error('GPT 요청 중 오류 발생:', err);
    throw err;
  }
}
