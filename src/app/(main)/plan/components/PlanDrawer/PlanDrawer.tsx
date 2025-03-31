'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Flex } from '@chakra-ui/react';
import { CloseButton } from '@/components/ui/close-button';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { PlaceDetails } from '@/types/interface';
import PlaceSelector from './PlaceSelector/PlaceSelector';
import PlanList from './PlanList';

function PlanDrawer() {
  const [isOpened, setIsOpened] = useState(true);
  const [currentDetailData, setCurrentDetailData] = useState<PlaceDetails | null | undefined>();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  const toggleModalOpen = () => setIsDetailModalOpen(prev => !prev);
  return (
    <>
      <Flex
        w={mode === 'result' ? undefined : '100%'}
        h={{ base: '70%', md: '100%' }}
        position="relative"
        display={isOpened ? 'block' : 'none'}>
        {mode === 'select' ? (
          <PlaceSelector
            currentDetailData={currentDetailData}
            isDetailModalOpen={isDetailModalOpen}
            setCurrentDetailData={setCurrentDetailData}
            onToggle={toggleModalOpen}
          />
        ) : (
          <PlanList
            currentDetailData={currentDetailData}
            setCurrentDetailData={setCurrentDetailData}
            isDetailModalOpen={isDetailModalOpen}
            onToggle={toggleModalOpen}
          />
        )}
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
      onClick={onClick}
      display={{ base: 'none', md: 'flex' }}>
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
      onClick={onClick}
      display={{ base: 'none', md: 'flex' }}>
      <MdKeyboardArrowRight />
    </CloseButton>
  );
};
