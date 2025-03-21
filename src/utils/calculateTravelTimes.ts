import { fetchDistanceMatrix } from '@/lib/api/distance';
import { ScheduleBlock } from '@/types/interface';

interface CalculateTravelTimesParams {
  schedule: ScheduleBlock[];
  mode: string;
  routeType: string;
  currentLocation: google.maps.LatLngLiteral;
}

const calculateTravelTimes = async ({ schedule, mode, routeType, currentLocation }: CalculateTravelTimesParams) => {
  if (schedule.length === 0) return [];

  const places = schedule.map(block => block.placeId).filter(Boolean) as string[];

  const finalSchedule: ScheduleBlock[] = [];

  // ✅ 1. 현재 위치에서 첫 번째 장소까지의 이동 블록 추가
  const firstTravel = await fetchDistanceMatrix({ origin: currentLocation, destination: places[0], mode });
  const firstMoveBlock: ScheduleBlock = {
    start: schedule[0].start,
    end: adjustTime(schedule[0].start, firstTravel?.duration.value || 0),
    activityType: 'move',
    placeId: null,
    travel: firstTravel
      ? {
          distance: firstTravel.distance.text,
          duration: firstTravel.duration.text,
        }
      : null,
  };
  finalSchedule.push(firstMoveBlock);

  // ✅ 2. 기존 일정의 각 장소 간 이동 거리 & 시간 요청
  const travelDataList = await Promise.all(
    places
      .slice(0, -1)
      .map((placeId, index) => fetchDistanceMatrix({ origin: placeId, destination: places[index + 1], mode }))
  );

  // ✅ 3. 각 블록을 이동 블록(`move`)과 일정 블록(`activity`)로 나누어 추가
  schedule.forEach((block, index) => {
    // ✅ 일정 블록의 start를 이전 move 블록의 end로 설정
    const lastEnd = finalSchedule[finalSchedule.length - 1].end;
    const updatedActivityBlock: ScheduleBlock = {
      ...block,
      start: lastEnd,
      travel: null, // ✅ 일정 블록에는 travel 없음
    };
    finalSchedule.push(updatedActivityBlock);

    // ✅ 마지막 블록이 아니면 move 블록 추가
    if (index < travelDataList.length) {
      const travelData = travelDataList[index];
      const moveBlock: ScheduleBlock = {
        start: updatedActivityBlock.end,
        end: adjustTime(updatedActivityBlock.end, travelData?.duration.value || 0),
        activityType: 'move',
        placeId: null,
        travel: travelData
          ? {
              distance: travelData.distance.text,
              duration: travelData.duration.text,
            }
          : null,
      };
      finalSchedule.push(moveBlock);
    }
  });

  // ✅ 4. 왕복일 경우, 마지막 장소에서 현재 위치로 돌아오는 이동 블록 추가
  if (routeType === '왕복') {
    const lastActivity = finalSchedule[finalSchedule.length - 1];
    const returnTravel = await fetchDistanceMatrix({
      origin: places[places.length - 1],
      destination: currentLocation,
      mode,
    });

    const returnMoveBlock: ScheduleBlock = {
      start: lastActivity.end,
      end: adjustTime(lastActivity.end, returnTravel?.duration.value || 0),
      activityType: 'move',
      placeId: null,
      travel: returnTravel
        ? {
            distance: returnTravel.distance.text,
            duration: returnTravel.duration.text,
          }
        : null,
    };
    finalSchedule.push(returnMoveBlock);
  }

  return finalSchedule;
};

export default calculateTravelTimes;

// ✅ 시간을 조정하는 함수
const adjustTime = (time: string, offsetInSeconds: number): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + Math.floor(offsetInSeconds / 60);

  const adjustedHours = Math.floor(totalMinutes / 60) % 24;
  const adjustedMinutes = totalMinutes % 60;

  return `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
};
