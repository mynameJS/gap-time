'use client';

import { Flex, Text, VStack, Box, Icon, createListCollection } from '@chakra-ui/react';
import { SelectRoot, SelectTrigger, SelectContent, SelectItem, SelectValueText } from '@/components/ui/select';
import { FaClock } from 'react-icons/fa';
import { PlanInfo } from '@/types/interface';

// 09:00 ~ 24:00 시간 목록 생성
const timeCollection = createListCollection({
  items: Array.from({ length: 16 }, (_, i) => {
    const hour = (i + 9).toString().padStart(2, '0'); // 9부터 시작
    return { label: `${hour}:00`, value: `${hour}:00` };
  }),
});

interface TimeSelectorProps {
  startTime: string[];
  endTime: string[];
  onUpdate: (updates: Partial<PlanInfo>) => void;
}

export default function TimeSelector({ startTime, endTime, onUpdate }: TimeSelectorProps) {
  // 오늘 날짜 (MM/DD 포맷)
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const formattedDate = `${month}/${day}`;

  // endTime 리스트 필터링 (startTime 이후 시간만)
  const filteredEndTimeCollection = createListCollection({
    items: startTime.length > 0 ? timeCollection.items.filter(time => time.value > startTime[0]) : timeCollection.items,
  });

  const handleTimeChange = (key: keyof PlanInfo, value: string[]) => {
    // 배열 형태로 변환하여 onUpdate로 넘기기
    onUpdate({ [key]: value });
  };

  return (
    <Flex gap={6} w="100%" align="center" justify="space-between" p={4} bg="gray.50" borderRadius="lg" boxShadow="sm">
      {/* 오늘 날짜 */}
      <VStack gap={1} align="center">
        <Text fontSize="sm" color="gray.600">
          오늘 날짜
        </Text>
        <Text fontSize="lg" fontWeight="bold" color="blue.500">
          {formattedDate}
        </Text>
      </VStack>

      {/* 시작 시간 선택 */}
      <VStack gap={1} align="center" w="30%">
        <Box display="flex" alignItems="center" gap={2}>
          <Icon as={FaClock} color="blue.400" />
          <Text fontSize="md" fontWeight="bold">
            시작 시간
          </Text>
        </Box>
        <SelectRoot
          collection={timeCollection}
          value={startTime}
          onValueChange={e => handleTimeChange('startTime', e.value)}>
          <SelectTrigger
            bg="white"
            borderRadius="md"
            boxShadow="xs"
            _hover={{ bg: 'gray.100' }}
            _focus={{ ring: 2, ringColor: 'blue.300' }}>
            <SelectValueText placeholder="시간 선택" />
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
      <VStack gap={1} align="center" w="30%">
        <Box display="flex" alignItems="center" gap={2}>
          <Icon as={FaClock} color="red.400" />
          <Text fontSize="md" fontWeight="bold">
            종료 시간
          </Text>
        </Box>
        <SelectRoot
          collection={filteredEndTimeCollection}
          value={endTime}
          onValueChange={e => handleTimeChange('endTime', e.value)}
          disabled={startTime.length === 0}>
          <SelectTrigger
            bg="white"
            borderRadius="md"
            boxShadow="xs"
            _hover={{ bg: 'gray.100' }}
            _focus={{ ring: 2, ringColor: 'red.300' }}>
            <SelectValueText placeholder="시간 선택" />
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
