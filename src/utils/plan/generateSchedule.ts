import { fetchNearbyPlaces, fetchPlaceDetailsWithPhoto } from '@/lib/api/google/places';
import { PlaceDetails } from '@/types/interface';
import getRandomIndexes from '../getRandomIndexes';
import getActivityByTimes from './getActivityByTimes';
import getTimeBlocks from './getTimeBlocks';

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
        // ✅ 반경 대신 거리순( 그 중에서도 리뷰 많은순으로 정렬되있음
        const placeList = await fetchNearbyPlaces({ latitude, longitude, type, sortBy: 'distance' });

        // ✅ 랜덤한 인덱스 선택 후 해당 인덱스의 place_id만 추출
        const randomIndexes = getRandomIndexes(placeList.length, count);
        placesMap[type] = randomIndexes.map(index => placeList[index].place_id);
      } catch (error) {
        console.error(`Error fetching places for type: ${type}`, error);
        placesMap[type] = []; // 에러 발생 시 빈 배열 처리
      }
    }),
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

  // ✅ 장소 ID를 기반으로 상세 정보 가져오기 (병렬 처리)
  const placeDetailsMap: Record<string, PlaceDetails> = {};
  await Promise.all(
    Object.values(placesMap)
      .flat()
      .map(async placeId => {
        const details = await fetchPlaceDetailsWithPhoto(placeId);
        if (details) placeDetailsMap[placeId] = details;
      }),
  );

  const schedule = scheduleBlocks.map(block => {
    // ✅ activityType을 다시 랜덤 선택하지 않고, 고정된 값 사용
    const { activityType } = block;

    // ✅ 중복되지 않는 place_id 배정
    const availablePlaces = placesMap[activityType] ?? [];
    const placeId = availablePlaces.find(id => !usedPlaceIds.has(id)) ?? null; // ✅ 기본값 null 처리

    if (placeId) usedPlaceIds.add(placeId); // ✅ 중복 체크용 Set에 추가

    return {
      ...block,
      placeId,
      placeDetails: placeId ? placeDetailsMap[placeId] : null,
    };
  });

  return schedule;
};

export default generateSchedule;
