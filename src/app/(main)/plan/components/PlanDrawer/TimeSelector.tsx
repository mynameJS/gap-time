'use client';

import { useState } from 'react';
import { Flex, Text, VStack, createListCollection } from '@chakra-ui/react';
import { SelectRoot, SelectTrigger, SelectContent, SelectItem, SelectValueText } from '@/components/ui/select';

// 시간 목록 생성 (00:00 ~ 23:00)
const timeCollection = createListCollection({
  items: Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0'); // 두 자리 숫자 변환
    return { label: `${hour}:00`, value: `${hour}:00` };
  }),
});

export default function TimeSelector() {
  const [startTime, setStartTime] = useState<string[]>([]);
  const [endTime, setEndTime] = useState<string[]>([]);
  // 오늘 날짜 (MM/DD 포맷)
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const formattedDate = `${month}/${day}`;

  // endTime 리스트 필터링 (startTime 이후 시간만)
  const filteredEndTimeCollection = createListCollection({
    items: startTime.length > 0 ? timeCollection.items.filter(time => time.value > startTime[0]) : timeCollection.items,
  });

  return (
    <Flex gap={4} w="100%" h="100px" borderWidth={3} align={'center'} justify={'center'}>
      {/* 오늘 날짜 */}
      <VStack>
        <Text fontSize="sm">오늘 날짜</Text>
        <Text fontSize="lg" fontWeight="bold">
          {formattedDate}
        </Text>
      </VStack>
      {/* 시작 시간 선택 */}
      <VStack gap={1} align="start" w="20%" minW={'200px'}>
        <Text fontSize="sm">시작 시간</Text>
        <SelectRoot collection={timeCollection} value={startTime} onValueChange={e => setStartTime(e.value)}>
          <SelectTrigger>
            <SelectValueText placeholder="시작 시간 선택" />
          </SelectTrigger>
          <SelectContent zIndex={9999}>
            {timeCollection.items.map(time => (
              <SelectItem key={time.value} item={time}>
                {time.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      </VStack>

      {/* 종료 시간 선택 */}
      <VStack gap={1} align="start" w="20%" minW={'200px'}>
        <Text fontSize="sm">종료 시간</Text>
        <SelectRoot
          collection={filteredEndTimeCollection}
          value={endTime}
          onValueChange={e => setEndTime(e.value)}
          disabled={startTime.length === 0}>
          <SelectTrigger>
            <SelectValueText placeholder="종료 시간 선택" />
          </SelectTrigger>
          <SelectContent zIndex={9999}>
            {filteredEndTimeCollection.items.map(time => (
              <SelectItem key={time.value} item={time}>
                {time.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      </VStack>
    </Flex>
  );
}
