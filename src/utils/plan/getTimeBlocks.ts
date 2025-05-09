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
  const totalMinutes = (endTime - startTime) / 60;

  const blocks = [];
  let currentTime = startTime;

  while (currentTime < endTime) {
    let blockDuration = 120;

    if (totalMinutes <= 180) blockDuration = 90;
    if (totalMinutes <= 90) blockDuration = 60;

    if (currentTime + blockDuration * 60 > endTime) {
      blockDuration = (endTime - currentTime) / 60;
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
