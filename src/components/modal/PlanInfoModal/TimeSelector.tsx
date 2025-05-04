'use client';

import { HStack, Flex, Text, VStack, Icon, createListCollection } from '@chakra-ui/react';
import { FaClock } from 'react-icons/fa';
import { SelectRoot, SelectTrigger, SelectContent, SelectItem, SelectValueText } from '@/components/ui/select';
import { PlanInfo } from '@/types/interface';

const timeCollection = createListCollection({
  items: Array.from({ length: 16 }, (_, i) => {
    const hour = (i + 9).toString().padStart(2, '0');
    return { label: `${hour}:00`, value: `${hour}:00` };
  }),
});

interface TimeSelectorProps {
  startTime: string[];
  endTime: string[];
  onUpdate: (updates: Partial<PlanInfo>) => void;
  isInvalid: boolean;
}

export default function TimeSelector({ startTime, endTime, onUpdate, isInvalid }: TimeSelectorProps) {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const formattedDate = `${month} / ${day}`;

  const filteredEndTimeCollection = createListCollection({
    items: startTime.length > 0 ? timeCollection.items.filter(time => time.value > startTime[0]) : timeCollection.items,
  });

  const handleTimeChange = (key: keyof PlanInfo, value: string[]) => {
    onUpdate({ [key]: value });
  };

  return (
    <Flex direction="column" gap={4}>
      {/* 상단 타이틀 */}
      <HStack>
        <Icon as={FaClock} color="teal.500" />
        <Text fontSize="md" fontWeight="bold">
          일정 시간 선택
        </Text>
        {isInvalid && (
          <Text fontSize="xs" color="red.400">
            (필수 항목입니다)
          </Text>
        )}
      </HStack>

      {/* 시간 선택 카드 */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 6, md: 8 }}
        w="100%"
        align="center"
        justify="space-between"
        p={6}
        bg="gray.50"
        borderRadius="xl"
        boxShadow="sm">
        {/* 날짜 */}
        <VStack gap={1} align="center" w={{ base: '100%', md: '20%' }}>
          <Text fontSize="sm" color="gray.500">
            오늘 날짜
          </Text>
          <Text fontSize="lg" fontWeight="bold" color="teal.600">
            {formattedDate}
          </Text>
        </VStack>

        {/* 시작 시간 */}
        <VStack gap={1} align="center" w={{ base: '100%', md: '30%' }}>
          <HStack>
            <Icon as={FaClock} color="blue.400" />
            <Text fontSize="md" fontWeight="semibold">
              시작 시간
            </Text>
          </HStack>
          <SelectRoot
            collection={timeCollection}
            value={startTime}
            onValueChange={e => handleTimeChange('startTime', e.value)}>
            <SelectTrigger
              bg="white"
              borderRadius="md"
              boxShadow="sm"
              _hover={{ bg: 'gray.100' }}
              _focus={{ ring: 2, ringColor: 'blue.300' }}
              w="100%">
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

        {/* 종료 시간 */}
        <VStack gap={1} align="center" w={{ base: '100%', md: '30%' }}>
          <HStack>
            <Icon as={FaClock} color="red.400" />
            <Text fontSize="md" fontWeight="semibold">
              종료 시간
            </Text>
          </HStack>
          <SelectRoot
            collection={filteredEndTimeCollection}
            value={endTime}
            onValueChange={e => handleTimeChange('endTime', e.value)}
            disabled={startTime.length === 0}>
            <SelectTrigger
              bg="white"
              borderRadius="md"
              boxShadow="sm"
              _hover={{ bg: 'gray.100' }}
              _focus={{ ring: 2, ringColor: 'red.300' }}
              w="100%">
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
    </Flex>
  );
}
