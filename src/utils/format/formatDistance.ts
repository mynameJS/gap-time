// m 단위 km 로 변환

function formatDistance(meters: number | undefined): string {
  if (!meters) return '알 수 없음';
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

export default formatDistance;
