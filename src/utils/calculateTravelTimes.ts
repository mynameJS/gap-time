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

  // ✅ 현재 위치에서 첫 번째 장소까지 거리 & 시간 요청
  const firstPlaceId = places[0];
  const firstTravel = await fetchDistanceMatrix({ origin: currentLocation, destination: firstPlaceId, mode });

  // ✅ 새로운 'start' 블록 추가 (현재 위치 → 첫 번째 장소)
  const startBlock = {
    start: firstTravel ? adjustTime(schedule[0].start, -firstTravel.duration.value) : schedule[0].start, // 이동 시간 고려하여 start 조정
    end: schedule[0].start, // 첫 번째 일정 시작시간과 동일
    activityType: 'start',
    placeId: 'currentLocation',
    travel: firstTravel
      ? {
          distance: firstTravel.distance.text,
          duration: firstTravel.duration.text,
        }
      : null,
  };

  // ✅ 기존 일정의 각 장소 간 이동 거리 & 시간 요청
  const travelDataList = await Promise.all(
    places.slice(0, -1).map((placeId, index) => {
      return fetchDistanceMatrix({ origin: placeId, destination: places[index + 1], mode });
    })
  );

  // ✅ 기존 일정에 travel 정보 추가 & start 시간 조정
  const updatedSchedule = schedule.map((block, index) => {
    if (index === 0) return block; // 첫 번째 블록은 기존 start 유지 (startBlock에서 이미 조정됨)

    const prevBlock = schedule[index - 1]; // 이전 블록 정보 가져오기
    const travelData = travelDataList[index - 1]; // 이동 거리 & 시간 정보 가져오기

    return {
      ...block,
      start: travelData ? adjustTime(prevBlock.end, travelData.duration.value) : prevBlock.end, // ✅ start 시간 조정
      travel: travelData
        ? {
            distance: travelData.distance.text,
            duration: travelData.duration.text,
          }
        : null, // 마지막 장소의 경우 travel은 null
    };
  });

  // ✅ 왕복일 경우 마지막 장소에서 현재 위치로 돌아오는 일정 추가
  const finalSchedule = [startBlock, ...updatedSchedule];

  if (routeType === '왕복') {
    const lastPlaceId = places[places.length - 1];
    const returnTravel = await fetchDistanceMatrix({ origin: lastPlaceId, destination: currentLocation, mode });

    finalSchedule.push({
      start: returnTravel
        ? adjustTime(updatedSchedule[updatedSchedule.length - 1].end, returnTravel.duration.value)
        : updatedSchedule[updatedSchedule.length - 1].end,
      end: returnTravel
        ? adjustTime(updatedSchedule[updatedSchedule.length - 1].end, returnTravel.duration.value)
        : updatedSchedule[updatedSchedule.length - 1].end,
      activityType: 'end',
      placeId: 'currentLocation',
      travel: returnTravel
        ? {
            distance: returnTravel.distance.text,
            duration: returnTravel.duration.text,
          }
        : null,
    });
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
