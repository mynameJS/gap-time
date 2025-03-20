import { useState } from 'react';
import { Button, VStack, HStack, Text, Icon, Image, Badge } from '@chakra-ui/react';
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot } from '@/components/ui/dialog';
import { FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';
import { TargetedPlaceData } from '@/types/interface';

interface PlaceDetailModalProps {
  currentDetailData: TargetedPlaceData | undefined;
  isDetailModalOpen: boolean;
  onToggle: () => void;
}

function PlaceDetailModal({ currentDetailData, isDetailModalOpen, onToggle }: PlaceDetailModalProps) {
  if (!currentDetailData) return null;

  return (
    <DialogRoot open={isDetailModalOpen}>
      <DialogContent width="50%" maxWidth="90vw" maxHeight="90vh" borderRadius={12} boxShadow="xl" p={6}>
        {/* 헤더 */}
        <DialogHeader>
          <HStack justify="space-between" w="100%">
            <VStack align="start">
              <Text fontSize="2xl" fontWeight="bold">
                {currentDetailData.name}{' '}
                <Badge colorScheme="blue" fontSize="sm">
                  {currentDetailData.type}
                </Badge>
              </Text>
              <Text fontSize="md" color="gray.600">
                {currentDetailData.name}
              </Text>
            </VStack>
            {/* 닫기 버튼 */}
            <Button variant="ghost" onClick={onToggle}>
              ❌
            </Button>
          </HStack>
        </DialogHeader>

        {/* 본문 */}
        <DialogBody p={4}>
          {/* 대표 이미지 */}
          <Image
            src={
              currentDetailData.photo_reference
                ? `/api/google-maps/photo?photo_reference=${currentDetailData.photo_reference}`
                : currentDetailData.icon[0]
            }
            alt={currentDetailData.name}
            borderRadius="md"
            w="100%"
            maxH="300px"
          />

          {/* 설명 */}
          <Text mt={4} fontSize="md" color="gray.700">
            설명적는란
          </Text>

          {/* 주소, 연락처, 영업시간 */}
          <VStack align="start" gap={3}>
            <HStack>
              <Icon as={FaMapMarkerAlt} color="red.400" />
              <Text fontSize="sm">{currentDetailData.vicinity}</Text>
            </HStack>
            <HStack>
              <Icon as={FaPhone} color="blue.400" />
              <Text fontSize="sm">전화번호</Text>
            </HStack>
            <HStack>
              <Icon as={FaClock} color="green.400" />
              <Text fontSize="sm">영업시간</Text>
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
