'use client';

import { Box, HStack, Text, Avatar, VStack, Icon } from '@chakra-ui/react';
import { useState } from 'react';
import { FaGear } from 'react-icons/fa6';
import MyInfoModal from '@/components/modal/MyInfoModal/MyInfoModal';
import { UserInfo } from '@/types/interface';

interface MyInfoProps {
  userInfo: UserInfo | null;
}

function MyInfo({ userInfo }: MyInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  if (!userInfo) return null;

  return (
    <Box>
      <VStack>
        <Avatar.Root variant="solid" colorPalette="teal" size="2xl">
          <Avatar.Fallback name={userInfo.nickname} />
        </Avatar.Root>
        <HStack
          align="center"
          justify="center"
          _hover={{ textDecoration: 'underline' }}
          cursor="pointer"
          ml={5}
          onClick={handleToggle}>
          <Text fontWeight="bold" fontSize="xl">
            {userInfo.nickname}
          </Text>
          <Icon as={FaGear} boxSize="4" color="gray.500" />
        </HStack>
      </VStack>
      <MyInfoModal isOpen={isOpen} onToggle={handleToggle} userInfo={userInfo} />
    </Box>
  );
}

export default MyInfo;
