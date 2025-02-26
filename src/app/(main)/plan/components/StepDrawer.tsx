'use client';

import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { CloseButton } from '@/components/ui/close-button';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

function StepDrawer() {
  const [isOpened, setIsOpened] = useState(true);

  return (
    <>
      {isOpened ? (
        <Box width="30%" height="100%" position="relative">
          <CloseCustomButton onClick={() => setIsOpened(false)} />
        </Box>
      ) : (
        <OpenCustomButton onClick={() => setIsOpened(true)} />
      )}
    </>
  );
}

export default StepDrawer;

const CloseCustomButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <CloseButton
      variant="solid"
      aria-label="Close"
      w="20px"
      h="60px"
      minW="unset"
      position="absolute"
      top="50%"
      right="-20px"
      transform="translateY(-50%)"
      zIndex="100"
      onClick={onClick}>
      <MdKeyboardArrowLeft />
    </CloseButton>
  );
};

const OpenCustomButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <CloseButton
      variant="solid"
      aria-label="Open"
      w="20px"
      h="60px"
      minW="unset"
      position="absolute"
      top="50%"
      left="0"
      transform="translateY(-50%)"
      zIndex="100"
      onClick={onClick}>
      <MdKeyboardArrowRight />
    </CloseButton>
  );
};
