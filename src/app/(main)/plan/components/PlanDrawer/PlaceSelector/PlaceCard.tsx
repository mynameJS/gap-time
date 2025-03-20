import { Box, HStack, VStack, Text, Icon, Badge, Avatar } from '@chakra-ui/react';
import { FaStar, FaTag } from 'react-icons/fa';

interface PlaceCardProps {
  name: string;
  activityType: string;
  icon: [string, string]; // [icon URL, background color]
  rating: number;
  total_reviews: number;
  photo_reference?: string;
}

function PlaceCard({ name, activityType, icon, rating, total_reviews, photo_reference }: PlaceCardProps) {
  // ✅ 사진 > 아이콘 > fallback 우선순위
  const imageUrl = photo_reference ? `/api/google-maps/photo?photo_reference=${photo_reference}` : icon[0] || null;

  return (
    <Box
      w="100%"
      p={4}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="sm"
      bg="white"
      _hover={{ boxShadow: 'md', transform: 'scale(1.02)', transition: '0.2s ease-in-out' }}>
      <HStack gap={4}>
        {/* ✅ 대표 이미지 (사진 > 아이콘 > fallback) */}
        <Avatar.Root size="lg" shape="square" boxSize="80px" bg={icon[1] || 'gray.200'}>
          <Avatar.Fallback name={name} />
          {imageUrl ? <Avatar.Image src={imageUrl} /> : null}
        </Avatar.Root>

        {/* 장소 정보 */}
        <VStack align="start" gap={1} flex={1}>
          <Text fontSize="lg" fontWeight="bold">
            {name}
          </Text>
          {/* ✅ 활동 유형 표시 */}
          <HStack>
            <Icon as={FaTag} color="purple.500" />
            <Badge colorPalette="blue" fontSize="0.8rem">
              {activityType}
            </Badge>
          </HStack>
          {/* ✅ 평점 */}
          <HStack>
            <Icon as={FaStar} color="yellow.400" />
            <Text fontSize="sm">
              {rating.toFixed(1)} ({total_reviews.toLocaleString()} 리뷰)
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
}

export default PlaceCard;
