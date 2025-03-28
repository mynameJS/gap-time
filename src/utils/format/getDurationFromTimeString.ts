// 09:00 , 12:00 과 같은 시간 문자열 간 시간차 계산 함수

type paramsType = string | undefined;

const getDurationFromTimeString = (start: paramsType, end: paramsType) => {
  if (!(start && end)) return;

  const startHour = start.split(':').map(Number)[0];
  const endHour = end.split(':').map(Number)[0];
  const diffHour = endHour - startHour;
  return diffHour;
};

export default getDurationFromTimeString;
