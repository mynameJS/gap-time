const timeToSeconds = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60;
};

const secondsToTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  return `${hours}:${minutes}`;
};

const getTimeBlocks = (startTimeStr: string, endTimeStr: string) => {
  const startTime = timeToSeconds(startTimeStr);
  const endTime = timeToSeconds(endTimeStr);
  const totalMinutes = (endTime - startTime) / 60; // 총 이용 가능 시간 (분)

  const blocks = [];
  let currentTime = startTime;

  while (currentTime < endTime) {
    let blockDuration = 120; // 기본 2시간 블록

    if (totalMinutes <= 180) blockDuration = 90; // 총 시간이 3시간 이하라면 1.5시간 블록
    if (totalMinutes <= 90) blockDuration = 60; // 총 시간이 1.5시간 이하라면 1시간 블록

    // ✅ 현재 블록의 끝 시간이 `endTime`을 초과하면 조정
    if (currentTime + blockDuration * 60 > endTime) {
      blockDuration = (endTime - currentTime) / 60; // 남은 시간을 블록 크기로 설정
    }

    blocks.push({
      start: secondsToTime(currentTime),
      end: secondsToTime(currentTime + blockDuration * 60),
    });

    currentTime += blockDuration * 60;
  }

  return blocks;
};

export default getTimeBlocks;
