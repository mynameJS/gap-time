'use client';

import { Button, VStack, HStack, Text, Icon, Image, Badge, Collapsible, Link } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaPhone, FaClock, FaExternalLinkAlt } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import { DialogBody, DialogContent, DialogHeader, DialogRoot } from '@/components/ui/dialog';
import { PLACES_CATEGORY_COLOR_SET } from '@/constants/place';
import { PlaceDetails } from '@/types/interface';

interface PlaceDetailModalProps {
  currentDetailData: PlaceDetails | undefined;
  isDetailModalOpen: boolean;
  onToggle: () => void;
}

function PlaceDetailModal({ currentDetailData, isDetailModalOpen, onToggle }: PlaceDetailModalProps) {
  const categoryInfo = currentDetailData?.type
    ? (PLACES_CATEGORY_COLOR_SET[currentDetailData.type as keyof typeof PLACES_CATEGORY_COLOR_SET] ?? {
        ko: currentDetailData.type,
        color: 'gray',
      })
    : null;

  const typeBadge = categoryInfo ? (
    <Badge colorPalette={categoryInfo.color} fontSize="sm">
      {categoryInfo.ko}
    </Badge>
  ) : null;

  return (
    <DialogRoot open={isDetailModalOpen} onEscapeKeyDown={onToggle}>
      <DialogContent
        w={{ base: '100%', md: '700px' }}
        maxW="90vw"
        maxH="90vh"
        borderRadius="xl"
        boxShadow="2xl"
        p={{ base: 4, md: 6 }}
        overflow="auto"
        bg="white">
        {/* 헤더 */}
        <DialogHeader mb={2}>
          <HStack justify="space-between" align="flex-start" w="100%">
            <VStack align="start" gap={1}>
              <HStack gap={2} align="center">
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                  {currentDetailData?.name || '장소 정보 없음'}
                </Text>
                {typeBadge}
              </HStack>
              {currentDetailData?.address && (
                <Text fontSize="sm" color="gray.600" mt={1}>
                  {currentDetailData.address}
                </Text>
              )}
            </VStack>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <Icon as={ImCross} />
            </Button>
          </HStack>
        </DialogHeader>

        {/* 본문 */}
        <DialogBody>
          {currentDetailData ? (
            <VStack gap={6} align="stretch">
              {/* 대표 이미지 */}
              <Image
                src={currentDetailData.photo_url ?? currentDetailData.icon[0]}
                alt={currentDetailData.name}
                borderRadius="md"
                w="100%"
                maxH="300px"
                objectFit="cover"
              />

              {/* 설명 */}
              {currentDetailData.summary && (
                <Text fontSize="md" fontWeight="medium" color="gray.700" lineHeight="1.6">
                  {currentDetailData.summary}
                </Text>
              )}

              {/* 정보 목록 */}
              <VStack gap={3} align="start">
                {currentDetailData.address && (
                  <HStack>
                    <Icon as={FaMapMarkerAlt} color="red.400" />
                    <Text fontSize="sm" color="gray.700">
                      {currentDetailData.address}
                    </Text>
                  </HStack>
                )}
                {currentDetailData.phone_number && (
                  <HStack>
                    <Icon as={FaPhone} color="blue.400" />
                    <Text fontSize="sm" color="gray.700">
                      {currentDetailData.phone_number}
                    </Text>
                  </HStack>
                )}

                {/* Collapse - 영업시간 */}
                {currentDetailData.open_hours?.weekday_text?.length > 0 && (
                  <HStack w="100%" h="100%">
                    <Collapsible.Root unmountOnExit>
                      <Collapsible.Trigger fontSize="sm">
                        <HStack gap={2} cursor="pointer">
                          <Icon as={FaClock} color="green.500" />
                          <Text fontSize="sm" color="gray.700">
                            영업시간 보기
                          </Text>
                        </HStack>
                      </Collapsible.Trigger>
                      <Collapsible.Content>
                        <VStack mt={2} p={3} borderRadius="md" bg="gray.50" align="stretch">
                          {currentDetailData.open_hours.weekday_text.map((text, idx) => (
                            <Text key={idx} fontSize="sm" color="gray.800" lineHeight="1.5">
                              {text}
                            </Text>
                          ))}
                        </VStack>
                      </Collapsible.Content>
                    </Collapsible.Root>
                  </HStack>
                )}
              </VStack>

              {/* 외부 링크 */}
              <HStack wrap="wrap" gap={3} pt={2}>
                {currentDetailData.website && (
                  <Link
                    href={currentDetailData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                    px={4}
                    py={2}
                    fontSize="sm"
                    fontWeight="medium"
                    borderRadius="md"
                    bg="teal.50"
                    color="teal.700"
                    transition="all 0.2s"
                    _hover={{ bg: 'teal.100', textDecoration: 'none' }}>
                    <Icon as={FaExternalLinkAlt} boxSize={3} />
                    공식 웹사이트
                  </Link>
                )}
                {currentDetailData.url && (
                  <Link
                    href={currentDetailData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                    px={4}
                    py={2}
                    fontSize="sm"
                    fontWeight="medium"
                    borderRadius="md"
                    bg="gray.100"
                    color="gray.700"
                    transition="all 0.2s"
                    _hover={{ bg: 'gray.200', textDecoration: 'none' }}>
                    <Icon as={FaExternalLinkAlt} boxSize={3} />
                    구글 상세 보기
                  </Link>
                )}
              </HStack>
            </VStack>
          ) : (
            <VStack py={8} align="center">
              <Text fontSize="lg" fontWeight="bold" color="gray.600">
                장소 정보를 불러올 수 없습니다.
              </Text>
              <Text fontSize="sm" color="gray.500">
                잠시 후 다시 시도해 주세요.
              </Text>
            </VStack>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}

export default PlaceDetailModal;
