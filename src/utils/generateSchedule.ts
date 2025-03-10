import { fetchNearbyPlaces } from '@/lib/api/places';
import getTimeBlocks from './getTimeBlocks';
import getActivityByTimes from './getActivityByTimes';
import getRandomIndexes from './getRandomIndexes';

interface FetchAllNearbyPlacesParams {
  latitude: number;
  longitude: number;
  activityCounts: Record<string, number>;
}

const fetchAllNearbyPlaces = async ({ latitude, longitude, activityCounts }: FetchAllNearbyPlacesParams) => {
  const placesMap: Record<string, string[]> = {}; // type별 place_id 저장

  await Promise.all(
    Object.entries(activityCounts).map(async ([type, count]) => {
      try {
        const placeList = await fetchNearbyPlaces({ latitude, longitude, type });

        // ✅ 정상 영업 중인 곳만 필터링
        const filteredList = placeList.filter((place: any) => place.business_status === 'OPERATIONAL');

        // ✅ 랜덤한 인덱스 선택 후 해당 인덱스의 place_id만 추출
        const randomIndexes = getRandomIndexes(filteredList.length, count);
        placesMap[type] = randomIndexes.map(index => filteredList[index].place_id);
      } catch (error) {
        console.error(`Error fetching places for type: ${type}`, error);
        placesMap[type] = []; // 에러 발생 시 빈 배열 처리
      }
    })
  );
  return placesMap;
};

interface GenerateScheduleParams {
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
}

const generateSchedule = async ({ startTime, endTime, latitude, longitude }: GenerateScheduleParams) => {
  const timeBlocks = getTimeBlocks(startTime, endTime); // 시간 블록 생성

  // ✅ 각 블록에 대해 미리 activityType을 확정하고, 카운트 저장
  const activityCounts: Record<string, number> = {};
  const scheduleBlocks = timeBlocks.map(block => {
    const activity = getActivityByTimes(block.start);
    const activityType = Array.isArray(activity)
      ? activity[Math.floor(Math.random() * activity.length)] // 랜덤 선택
      : activity;

    activityCounts[activityType] = (activityCounts[activityType] || 0) + 1;

    return { ...block, activityType }; // ✅ 확정된 activityType을 블록에 저장
  });

  // ✅ 미리 activity type별 place_id를 가져옴
  const placesMap = await fetchAllNearbyPlaces({ latitude, longitude, activityCounts });
  const usedPlaceIds = new Set<string>(); // ✅ 중복 체크용 Set

  const schedule = scheduleBlocks.map(block => {
    // ✅ activityType을 다시 랜덤 선택하지 않고, 고정된 값 사용
    const { activityType } = block;

    // ✅ 중복되지 않는 place_id 배정
    const availablePlaces = placesMap[activityType] ?? [];
    const placeId = availablePlaces.find(id => !usedPlaceIds.has(id)) ?? null; // ✅ 기본값 null 처리

    if (placeId) usedPlaceIds.add(placeId); // ✅ 중복 체크용 Set에 추가

    return {
      ...block,
      placeId, // ✅ 장소 ID만 먼저 배정 (세부 정보는 나중에 fetch)
    };
  });

  return schedule;
};

export default generateSchedule;
