const getActivityByTimes = (startTime: string): string | string[] => {
  const hour = parseInt(startTime.split(':')[0], 10);

  if (hour >= 12 && hour < 14) return 'restaurant'; // 점심 (12:00 - 13:00)
  if (hour >= 18 && hour < 20) return 'restaurant'; // 저녁 (18:00 - 19:00)
  if (hour >= 9 && hour < 12) return ['tourist_attraction', 'museum', 'park']; // 오전 관광
  if (hour >= 14 && hour < 17) return ['tourist_attraction', 'art_gallery', 'shopping_mall']; // 점심 이후 관광 & 쇼핑
  if (hour >= 17 && hour < 18) return ['cafe', 'shopping_mall', 'park']; // 저녁 전 카페, 쇼핑
  if (hour >= 20 && hour < 21) return ['movie_theater', 'bar']; // 저녁 이후 문화생활 & 바
  return ['bar', 'night_club', 'tourist_attraction']; // 21:00~24:00 술집, 야경 명소
};

// ✅ 시간대별 추천 type 표
// 시간대	추천 활동 (activity)	Google Places API type
// 09:00 - 12:00	관광지 방문 / 전시회 / 야외 활동	tourist_attraction, museum, park
// 12:00 - 13:00	점심 식사 (고정)	restaurant
// 13:00 - 17:00	관광지 방문 / 체험 활동 / 쇼핑	tourist_attraction, art_gallery, shopping_mall
// 17:00 - 18:00	카페 휴식 / 쇼핑 / 공원 산책	cafe, shopping_mall, park
// 18:00 - 19:00	저녁 식사 (고정)	restaurant
// 19:00 - 21:00	영화관 / 바 / 라운지	movie_theater, bar
// 21:00 - 24:00	술집 / 펍 / 라운지 / 야경 명소	bar, night_club, tourist_attraction

export default getActivityByTimes;

// https://developers.google.com/maps/documentation/places/web-service/supported_types
