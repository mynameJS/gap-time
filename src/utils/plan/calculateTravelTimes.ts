import { fetchRoute } from '@/lib/api/google/route';
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
  const firstTravel = await fetchRoute(currentLocation, places[0], mode);

  const firstMoveBlock: ScheduleBlock = {
    start: schedule[0].start,
    end: adjustTime(schedule[0].start, firstTravel?.duration || '0s'),
    activityType: 'move',
    placeId: null,
    travel: firstTravel
      ? {
          distance: firstTravel.distance,
          duration: firstTravel.duration,
          steps: firstTravel.steps, // ✅ 수정: polyline 대신 steps
          origin: currentLocation,
          destination: schedule[0]?.placeDetails?.geocode,
        }
      : null,
  };
  finalSchedule.push(firstMoveBlock);

  // ✅ 2. 기존 일정의 각 장소 간 이동 거리 & 시간 요청
  const travelDataList = await Promise.all(
    places.slice(0, -1).map((placeId, index) => fetchRoute(placeId, places[index + 1], mode)),
  );

  // ✅ 3. 각 블록을 이동 블록(`move`)과 일정 블록(`activity`)로 나누어 추가
  schedule.forEach((block, index) => {
    const lastEnd = finalSchedule[finalSchedule.length - 1].end;

    const updatedActivityBlock: ScheduleBlock = {
      ...block,
      start: lastEnd,
      travel: null,
    };
    finalSchedule.push(updatedActivityBlock);

    if (index < travelDataList.length) {
      const travelData = travelDataList[index];
      const moveBlock: ScheduleBlock = {
        start: updatedActivityBlock.end,
        end: adjustTime(updatedActivityBlock.end, travelData?.duration || '0s'),
        activityType: 'move',
        placeId: null,
        travel: travelData
          ? {
              distance: travelData.distance,
              duration: travelData.duration,
              steps: travelData.steps, // ✅ 수정
              origin: schedule[index].placeDetails?.geocode,
              destination: schedule[index + 1].placeDetails?.geocode,
            }
          : null,
      };
      finalSchedule.push(moveBlock);
    }
  });

  // ✅ 4. 왕복일 경우
  if (routeType === '왕복') {
    const lastActivity = finalSchedule[finalSchedule.length - 1];
    const returnTravel = await fetchRoute(places[places.length - 1], currentLocation, mode);

    const returnMoveBlock: ScheduleBlock = {
      start: lastActivity.end,
      end: adjustTime(lastActivity.end, returnTravel?.duration || '0s'),
      activityType: 'move',
      placeId: null,
      travel: returnTravel
        ? {
            distance: returnTravel.distance,
            duration: returnTravel.duration,
            steps: returnTravel.steps, // ✅ 수정
            origin: schedule[places.length - 1].placeDetails?.geocode,
            destination: currentLocation,
          }
        : null,
    };
    finalSchedule.push(returnMoveBlock);
  }

  return finalSchedule;
};

export default calculateTravelTimes;

// ✅ 시간을 조정하는 함수
const adjustTime = (time: string, offsetInSeconds: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const convertToNumber = Number(offsetInSeconds.split('s')[0]);
  const totalMinutes = hours * 60 + minutes + Math.floor(convertToNumber / 60);

  const adjustedHours = Math.floor(totalMinutes / 60) % 24;
  const adjustedMinutes = totalMinutes % 60;

  return `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
};
