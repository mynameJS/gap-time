'use client';

import { Button } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// ✅ PlanInfoModal만 dynamic import로 분리
const PlanInfoModal = dynamic(() => import('../../../components/modal/PlanInfoModal/PlanInfoModal'), {
  ssr: false,
  loading: () => null,
});

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
