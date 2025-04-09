'use client';

import { Box, Flex, Text, Image } from '@chakra-ui/react';
import PlanModalController from './components/PlanModalController';

export default function Page() {
  return (
    <Flex
      direction={{ base: 'column', lg: 'row' }}
      align="center"
      justify={{ base: 'center', lg: 'space-between' }}
      w="100%"
      h="100%"
      gap={{ base: 12, lg: 4 }}
      py={{ base: 12, lg: 0 }}>
      {/* Left Side */}
      <Box w={{ base: '100%', lg: '50%' }} textAlign={{ base: 'center', lg: 'left' }}>
        <Text
          fontSize={{ base: '2xl', md: '3xl', xl: '5xl', '2xl': '6xl' }}
          fontWeight="extrabold"
          lineHeight="1.4"
          mb={6}>
          당신의 하루를 더 알차게, <br />
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

      {/* Right Side */}
      <Box w={{ base: '100%', lg: '50%' }} maxW="600px" mx="auto" maxH={{ base: '300px', md: '400px', lg: 'none' }}>
        <Image
          src="/image/landing2.webp"
          alt="틈새시간 계획 일러스트"
          width="854px"
          objectFit="contain"
          w="100%"
          aspectRatio={854 / 570}
          mx="auto"
        />
      </Box>
    </Flex>
  );
}
