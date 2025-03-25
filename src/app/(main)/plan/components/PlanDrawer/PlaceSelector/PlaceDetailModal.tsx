import { useState, useEffect } from 'react';
import { Button, VStack, HStack, Text, Icon, Image, Badge, Collapsible, Box } from '@chakra-ui/react';
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot } from '@/components/ui/dialog';
import { FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';
import { TargetedPlaceData } from '@/types/interface';
import { fetchPlaceDetails } from '@/lib/api/places';
import { PlaceDetails } from '@/types/interface';

interface PlaceDetailModalProps {
  currentDetailData: TargetedPlaceData | undefined;
  isDetailModalOpen: boolean;
  onToggle: () => void;
}

function PlaceDetailModal({ currentDetailData, isDetailModalOpen, onToggle }: PlaceDetailModalProps) {
  const [additionalData, setAdditionalData] = useState<PlaceDetails>();

  useEffect(() => {
    const fetchDetail = async () => {
      if (!currentDetailData) return;
      const result = await fetchPlaceDetails(currentDetailData?.place_id);
      setAdditionalData(result);
    };

    fetchDetail();
  }, [currentDetailData]);

  if (!additionalData) return null;

  return (
    <DialogRoot open={isDetailModalOpen}>
      <DialogContent width="700px" maxW="80vw" maxH="90vh" borderRadius={12} boxShadow="xl" p={6} overflow={'auto'}>
        {/* 헤더 */}
        <DialogHeader>
          <HStack justify="space-between" w="100%">
            <VStack align="start">
              <Text fontSize="2xl" fontWeight="bold">
                {currentDetailData?.name}{' '}
                <Badge colorScheme="blue" fontSize="sm">
                  {currentDetailData?.type}
                </Badge>
              </Text>
              <Text fontSize="md" color="gray.600">
                {currentDetailData?.name}
              </Text>
            </VStack>
            {/* 닫기 버튼 */}
            <Button variant="ghost" onClick={onToggle}>
              ❌
            </Button>
          </HStack>
        </DialogHeader>

        {/* 본문 */}
        <DialogBody>
          {/* 대표 이미지 */}
          <Image
            src={
              currentDetailData?.photo_reference
                ? `/api/google-maps/photo?photo_reference=${currentDetailData?.photo_reference}`
                : currentDetailData?.icon[0]
            }
            alt={currentDetailData?.name}
            borderRadius="md"
            w="100%"
            maxH="300px"
          />

          {/* 설명 */}
          <Text mt={4} mb={4} fontSize="md" color="gray.700">
            {additionalData?.summary}
          </Text>

          {/* 주소, 연락처, 영업시간 */}
          <VStack align="start" gap={3}>
            <HStack>
              <Icon as={FaMapMarkerAlt} color="red.400" />
              <Text fontSize="sm">{additionalData?.address || '주소 정보 없음'}</Text>
            </HStack>
            <HStack>
              <Icon as={FaPhone} color="blue.400" />
              <Text fontSize="sm">{additionalData?.phone_number || '전화번호 정보 없음'}</Text>
            </HStack>
            <HStack w="100%" h="100%">
              <Collapsible.Root unmountOnExit>
                <Collapsible.Trigger fontSize="sm">
                  <HStack>
                    <Icon as={FaClock} color="green.400" />
                    <Text fontSize="sm">영업시간 </Text>
                  </HStack>
                </Collapsible.Trigger>
                <Collapsible.Content>
                  <VStack
                    w="100%"
                    bg="gray.50" // 연한 회색 배경
                    borderRadius="md"
                    gap={2}
                    align="center">
                    {additionalData.open_hours?.weekday_text?.map((text, idx) => (
                      <Box key={idx} w="100%" textAlign="center">
                        <Text fontSize="sm" fontWeight="medium" color="gray.700">
                          {text}
                        </Text>
                      </Box>
                    )) || (
                      <Text fontSize="sm" color="gray.500">
                        영업시간 정보 없음
                      </Text>
                    )}
                  </VStack>
                </Collapsible.Content>
              </Collapsible.Root>
            </HStack>
          </VStack>
        </DialogBody>

        {/* 푸터 */}
        <DialogFooter mt={4} justifyContent="flex-end">
          <Button colorScheme="blue" onClick={onToggle}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export default PlaceDetailModal;
