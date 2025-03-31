'use client';

import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import PlanInfoModal from './PlanInfoModal/PlanInfoModal';

function PlanModalController() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleModalOpen = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <Button onClick={toggleModalOpen} width="50%" height="60px" textStyle="md" fontSize="20px" cursor="pointer">
        틈새시간 이용하기
      </Button>
      <PlanInfoModal isOpen={isOpen} onToggle={toggleModalOpen} />
    </>
  );
}

export default PlanModalController;
