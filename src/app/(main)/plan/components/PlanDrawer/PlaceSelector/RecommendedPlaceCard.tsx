'use client';

import { Image, Text, VStack, HStack, Icon, IconButton } from '@chakra-ui/react';
import { useState } from 'react';
import { FaStar, FaPlus, FaCheck } from 'react-icons/fa';
import { PlaceDetails } from '@/types/interface';
import PlaceDetailModal from '../PlaceDetailModal';

interface RecommendedPlaceCardProps {
  place: PlaceDetails;
  onSelect: (place: PlaceDetails) => void;
  isSelected: boolean;
}

export function RecommendedPlaceCard({ place, onSelect, isSelected }: RecommendedPlaceCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggleModal = () => {
    setIsOpen(prev => !prev);
  };
  return (
    <VStack
      w={{ base: '120px', md: '140px' }}
      p={3}
      bg="white"
      boxShadow="sm"
      borderRadius="lg"
      gap={2}
      align="start"
      flexShrink={0}>
      <Image
        src={place.photo_url ?? place.icon[0]}
        alt={place.name}
        borderRadius="md"
        w="100%"
        h="90px"
        objectFit="cover"
        onClick={handleToggleModal}
        cursor="pointer"
      />
      <VStack align="start" gap={1} w="100%">
        <Text fontWeight="bold" fontSize="sm" truncate w="100%">
          {place.name}
        </Text>

        <Text fontSize="xs" color="gray.500" truncate w="100%">
          {place.vicinity}
        </Text>

        <HStack fontSize="xs" color="gray.600" w="100%" truncate>
          <Icon as={FaStar} />
          <Text truncate>
            {place.rating?.toFixed(1)} ({place.total_reviews} 리뷰)
          </Text>
        </HStack>
      </VStack>
      <IconButton
        onClick={() => onSelect(place)}
        size="xs"
        mt="auto"
        w="100%"
        aria-label={isSelected ? '제거' : '추가'}
        colorPalette={isSelected ? 'green' : 'gray'}>
        <Icon as={isSelected ? FaCheck : FaPlus} />
      </IconButton>
      <PlaceDetailModal currentDetailData={place} isDetailModalOpen={isOpen} onToggle={handleToggleModal} />
    </VStack>
  );
}
