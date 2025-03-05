'use client';

import { useState } from 'react';
import { Box, Flex, Input, Text, List } from '@chakra-ui/react';
import { InputGroup } from '@/components/ui/input-group';
import { CloseButton } from '@/components/ui/close-button';
import { CiSearch } from 'react-icons/ci';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import PlanInfoModal from './PlanInfoModal';
import { fetchNearbyPlaces } from '@/lib/api/places';
import usePlanStore from '@/store/usePlanInfoStore';

function PlanDrawer() {
  const [isOpened, setIsOpened] = useState(true);
  const { planInfo } = usePlanStore();
  console.log(planInfo);
  return (
    <>
      {isOpened ? (
        <Flex
          flexDirection={'column'}
          gap={1}
          w="50%"
          h="100%"
          position="relative"
          p={3}
          borderWidth={3}
          borderColor="black">
          <Text>서울</Text>
          <SearchBar />
          <Box borderWidth={3} w="100%" h="100%">
            <List.Root>
              {planInfo && (
                <>
                  <Text>{planInfo.startTime[0]}</Text>
                  <Text>{planInfo.endTime[0]}</Text>
                  <Text>{planInfo.transport}</Text>
                  <Text>{planInfo.formattedAddress}</Text>
                  <Text>{planInfo.geocode.lat}</Text>
                  <Text>{planInfo.geocode.lng}</Text>
                </>
              )}
            </List.Root>
          </Box>
          <PlanInfoModal />
          <CloseCustomButton onClick={() => setIsOpened(false)} />
        </Flex>
      ) : (
        <OpenCustomButton onClick={() => setIsOpened(true)} />
      )}
    </>
  );
}

export default PlanDrawer;

const SearchBar = () => {
  return (
    <InputGroup endElement={<CiSearch />} w="100%">
      <Input placeholder="검색어를 입력하세요" />
    </InputGroup>
  );
};

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
