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
  const placesMap: Record<string, string[]> = {};

  await Promise.all(
    Object.entries(activityCounts).map(async ([type, count]) => {
      try {
        const placeList = await fetchNearbyPlaces({ latitude, longitude, type, sortBy: 'distance' });

        const randomIndexes = getRandomIndexes(placeList.length, count);
        placesMap[type] = randomIndexes.map(index => placeList[index].place_id);
      } catch (error) {
        console.error(`Error fetching places for type: ${type}`, error);
        placesMap[type] = [];
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
  const timeBlocks = getTimeBlocks(startTime, endTime);

  const activityCounts: Record<string, number> = {};
  const scheduleBlocks = timeBlocks.map(block => {
    const activity = getActivityByTimes(block.start);
    const activityType = Array.isArray(activity) ? activity[Math.floor(Math.random() * activity.length)] : activity;

    activityCounts[activityType] = (activityCounts[activityType] || 0) + 1;

    return { ...block, activityType };
  });

  const placesMap = await fetchAllNearbyPlaces({ latitude, longitude, activityCounts });
  const usedPlaceIds = new Set<string>();

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
    const { activityType } = block;

    const availablePlaces = placesMap[activityType] ?? [];
    const placeId = availablePlaces.find(id => !usedPlaceIds.has(id)) ?? null;

    if (placeId) usedPlaceIds.add(placeId);

    return {
      ...block,
      placeId,
      placeDetails: placeId ? placeDetailsMap[placeId] : null,
    };
  });

  return schedule;
};

export default generateSchedule;
