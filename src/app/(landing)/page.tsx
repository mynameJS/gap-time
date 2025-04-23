'use client';

import { Box, Flex, Text, useBreakpointValue, Image, HStack, Icon } from '@chakra-ui/react';
import { FaBrain, FaClock } from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';
import PlanModalController from './components/PlanModalController';

export default function Page() {
  const imageMaxHeight = useBreakpointValue({ base: '300px', md: '350px', lg: '450px' });

  return (
    <Flex w="100%" h="100%" direction="column" justify="center" py={{ base: 8, lg: 12 }} userSelect="none">
      {/* 메인 콘텐츠 */}
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        align="center"
        justify={{ base: 'center', lg: 'space-between' }}
        w="100%"
        gap={{ base: 12, lg: 4 }}
        mb={{ base: 0, lg: 8 }}>
        {/* Left */}
        <Box w={{ base: '100%', lg: '50%' }} textAlign={{ base: 'center', lg: 'left' }}>
          <Text
            fontSize={{ base: '2xl', md: '3xl', xl: '5xl', '2xl': '6xl' }}
            fontWeight="extrabold"
            lineHeight="1.4"
            mb={6}>
            오늘 하루를 더 알차게, <br />
            틈새시간을 계획하는 <br />
            새로운 방법
          </Text>

          <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600" mb={8}>
            자투리 시간을 고민하지 말고, 지금 바로 계획해보세요.
          </Text>

          <Box display="flex" justifyContent={{ base: 'center', lg: 'flex-start' }}>
            <PlanModalController />
          </Box>
        </Box>

        {/* Right 이미지 */}
        <Box
          w={{ base: '100%', lg: '50%' }}
          maxW="600px"
          mx="auto"
          display="flex"
          justifyContent="center"
          alignItems="center">
          <Image
            src="/image/landing.webp"
            alt="틈새시간 계획 일러스트"
            width={854}
            height={570}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: imageMaxHeight,
              objectFit: 'contain',
            }}
          />
        </Box>
      </Flex>

      {/* 강조 포인트 */}
      <Box px={{ base: 4, lg: 20 }} w="100%" mt={{ base: 6, lg: 6 }}>
        <HStack
          gap={10}
          justify={{ base: 'center', lg: 'flex-end' }}
          align="center"
          fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
          fontWeight="semibold"
          color="gray.800"
          whiteSpace="nowrap"
          flexWrap={{ base: 'wrap', md: 'nowrap' }}>
          <HStack gap={2}>
            <Icon as={FaClock} boxSize={5} />
            <Text>간단한 일정 생성</Text>
          </HStack>
          <HStack gap={2}>
            <Icon as={FiMapPin} boxSize={5} />
            <Text>현재 위치 기반 추천</Text>
          </HStack>
          <HStack gap={2}>
            <Icon as={FaBrain} boxSize={5} />
            <Text>AI 장소 제안</Text>
          </HStack>
        </HStack>
      </Box>
    </Flex>
  );
}
