//  "2344s" 같은 문자열을 → "약 39분" 식으로 포맷

function formatDurationFromSeconds(durationStr: string | undefined): string {
  if (!durationStr) return '알 수 없음';

  if (!durationStr.endsWith('s')) return '알 수 없음';

  const totalSeconds = parseInt(durationStr.replace('s', ''), 10);
  if (isNaN(totalSeconds)) return '알 수 없음';

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  let result = '';
  if (h > 0) {
    result += `${h}시간`;
    if (m > 0) result += ` ${m}분`;
  } else if (m > 0) {
    result += `${m}분`;
  } else if (s > 0) {
    result += `${s}초`;
  } else {
    result = '0초';
  }

  return result;
}

export default formatDurationFromSeconds;
