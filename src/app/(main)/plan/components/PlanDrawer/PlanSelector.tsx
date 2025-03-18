'use client';

import { useState } from 'react';
import { Box, VStack, HStack, Input, Checkbox, Button, Text, Icon, List } from '@chakra-ui/react';
import { InputGroup } from '@/components/ui/input-group';
import { FaTrashAlt } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';

interface Place {
  id: string;
  name: string;
  checked: boolean;
}

const dummyPlaces: Place[] = [
  { id: '1', name: '서울 타워', checked: false },
  { id: '2', name: '경복궁', checked: false },
  { id: '3', name: '한강공원', checked: false },
  { id: '4', name: '남산 케이블카', checked: false },
  { id: '5', name: '롯데월드', checked: false },
];

export default function PlanSelector() {
  const [searchTerm, setSearchTerm] = useState('');
  const [places, setPlaces] = useState<Place[]>(dummyPlaces);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 장소 선택 핸들러
  const handleTogglePlace = (placeId: string) => {
    setPlaces(prev => prev.map(place => (place.id === placeId ? { ...place, checked: !place.checked } : place)));
  };

  // 선택한 장소 추가 핸들러
  const handleAddPlaces = () => {
    const selected = places.filter(place => place.checked);
    setSelectedPlaces(prev => [...prev, ...selected]);
    setPlaces(prev => prev.map(place => ({ ...place, checked: false }))); // 체크 초기화
  };

  // 선택한 장소 삭제 핸들러
  const handleRemovePlace = (placeId: string) => {
    setSelectedPlaces(prev => prev.filter(place => place.id !== placeId));
  };

  return (
    <Box w="100%" p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
      <VStack gap={4} align="stretch">
        {/* 🔍 검색 바 */}
        <InputGroup endElement={<CiSearch />} w="100%">
          <Input placeholder="장소를 검색하세요..." value={searchTerm} onChange={handleSearchChange} />
        </InputGroup>

        {/* 📍 검색 결과 리스트 */}
        <VStack align="stretch" gap={2}>
          {places.map(place => (
            <HStack key={place.id} p={2} borderWidth={1} borderRadius="md">
              <Checkbox.Root checked={place.checked}>
                <Checkbox.HiddenInput />
                <Checkbox.Control onClick={() => handleTogglePlace(place.id)} />
              </Checkbox.Root>
              <Text>{place.name}</Text>
            </HStack>
          ))}
          <Button colorScheme="blue" onClick={handleAddPlaces}>
            선택한 장소 추가
          </Button>
        </VStack>

        {/* 📌 선택된 장소 리스트 */}
        <VStack align="stretch" gap={2}>
          <Text fontSize="lg" fontWeight="bold">
            선택한 장소
          </Text>
          <List.Root gap={2}>
            {selectedPlaces.map(place => (
              <List.Item
                key={place.id}
                p={2}
                borderWidth={1}
                borderRadius="md"
                display="flex"
                justifyContent="space-between"
                alignItems="center">
                <Text>{place.name}</Text>
                <Button size="sm" colorScheme="red" onClick={() => handleRemovePlace(place.id)}>
                  <Icon as={FaTrashAlt} />
                </Button>
              </List.Item>
            ))}
          </List.Root>
        </VStack>
      </VStack>
    </Box>
  );
}
