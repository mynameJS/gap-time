import getTimeBlocks from './getTimeBlcoks';
import getActivityByTimes from './getActivityByTimes';

const generateSchedule = (startTimeStr: string, endTimeStr: string) => {
  const timeBlocks = getTimeBlocks(startTimeStr, endTimeStr); // 시간 블록 생성

  return timeBlocks.map(block => ({
    ...block,
    activity: getActivityByTimes(block.start), // 추천 활동 추가
  }));
};

export default generateSchedule;
