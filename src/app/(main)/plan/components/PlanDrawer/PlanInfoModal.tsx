import { useState } from 'react';
import { Button, VStack } from '@chakra-ui/react';
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from '@/components/ui/dialog';
import TimeSelector from './TimeSelector';
import TransportPicker from './TransportPicker';
import LocationPicker from './LocationPicker';

function PlanInfoModal() {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <DialogRoot open={isOpen}>
      <DialogContent width="60%" height="80%" maxWidth="90vw" maxHeight="80vh" margin="auto">
        <DialogHeader borderWidth={3}>
          <DialogTitle>일정 추천을 위한 사전 질문</DialogTitle>
        </DialogHeader>
        <DialogBody borderWidth={3}>
          <VStack align="center" gap={4}>
            <TimeSelector />
            <TransportPicker />
            <LocationPicker />
          </VStack>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            맞춤 일정 만들기
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export default PlanInfoModal;
