export function getIntroReply(prompt: string): string {
  const templates = [
    `"${prompt}" 관련해서 이런 장소는 어떠세요?`,
    `말씀해주신 "${prompt}"에 어울리는 곳을 찾아봤어요!`,
    `"${prompt}"에 잘 맞는 장소들을 골라봤어요 :)`,
    `요청하신 "${prompt}"에 어울릴 법한 장소를 추천드릴게요.`,
    `"${prompt}"을(를) 기준으로 이런 장소들이 괜찮을 것 같아요.`,
    `입력하신 "${prompt}"을 참고해서 추천드려요!`,
    `"${prompt}" 키워드를 기반으로 가까운 곳을 찾아봤어요!`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

export function getClosingReply(): string {
  const closings = [
    '다른 장소가 궁금하시면 언제든지 말씀해주세요!',
    '더 많은 장소가 필요하시면 편하게 입력해 주세요 :)',
    '마음에 드는 장소가 없다면 다른 조건으로 추천도 가능해요.',
    '원하시는 조건을 조금 더 자세히 알려주시면 더 정확한 추천이 가능해요!',
    '다른 분위기나 장소가 필요하시면 추가로 알려주세요!',
    '계속해서 다른 장소도 추천해드릴 수 있어요.',
    '추천이 마음에 드셨길 바라요. 다른 제안이 필요하면 말씀해주세요!',
  ];

  return closings[Math.floor(Math.random() * closings.length)];
}
