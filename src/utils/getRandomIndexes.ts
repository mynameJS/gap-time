// length 길이의 배열에서 count 개수만큼 랜덤한 인덱스를 선택하는 함수
const getRandomIndexes = (length: number, count: number): number[] => {
  const indexes = new Set<number>();
  while (indexes.size < Math.min(count, length)) {
    indexes.add(Math.floor(Math.random() * length));
  }
  return Array.from(indexes);
};

export default getRandomIndexes;
