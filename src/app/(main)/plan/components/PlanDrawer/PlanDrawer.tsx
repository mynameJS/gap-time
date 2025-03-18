'use client';

import { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { CloseButton } from '@/components/ui/close-button';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import usePlanStore from '@/store/usePlanInfoStore';
import PlanInfoModal from '../PlanInfoModal/PlanInfoModal';
import PlanSelector from './PlanSelector';
import PlanList from './PlanList';

function PlanDrawer() {
  const [isOpened, setIsOpened] = useState(true);
  const { planInfo } = usePlanStore();

  return (
    <>
      <Flex
        flexDirection="column"
        gap={1}
        w="50rem"
        h="100%"
        position="relative"
        p={4}
        display={isOpened ? 'block' : 'none'} // ✅ 화면에서만 숨김
      >
        {/* <PlanList /> */}
        <PlanSelector />
        {!planInfo && <PlanInfoModal />}
        <CloseCustomButton onClick={() => setIsOpened(false)} />
      </Flex>
      {!isOpened && <OpenCustomButton onClick={() => setIsOpened(true)} />}
    </>
  );
}

export default PlanDrawer;

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
