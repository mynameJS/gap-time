import { useState } from 'react';
import { Button, Text, VStack, HStack, createListCollection } from '@chakra-ui/react';
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from '@/components/ui/dialog';
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';

import LocationPicker from './LocationPicker';

const timeCollection = createListCollection({
  items: [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
  ],
});

function PlanInfoModal() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [selectedTime, setSelectedTime] = useState<string[]>([]);
  const [transport, setTransport] = useState<string>('');

  const handleClose = () => setIsOpen(false);

  return (
    <DialogRoot open={isOpen}>
      <DialogContent width="60%" height="80%" maxWidth="90vw" maxHeight="80vh" margin="auto">
        <DialogHeader borderWidth={3}>
          <DialogTitle>일정 추천을 위한 사전 질문</DialogTitle>
        </DialogHeader>
        <DialogBody borderWidth={3}>
          <VStack align="stretch">
            <VStack align="stretch">
              <Text>일정은 총 몇 시간이 걸리나요?</Text>
              <SelectRoot
                collection={timeCollection}
                width="320px"
                value={selectedTime}
                onValueChange={e => setSelectedTime(e.value)}>
                {/* <SelectLabel>Select time</SelectLabel> */}
                <SelectTrigger>
                  <SelectValueText placeholder="Select time" />
                </SelectTrigger>
                <SelectContent zIndex={9999}>
                  {timeCollection.items.map(time => (
                    <SelectItem item={time} key={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </VStack>
            <VStack align="stretch">
              <Text>이동수단이 무엇인가요?</Text>
              <HStack>
                <Button colorScheme={transport === '도보' ? 'blue' : 'gray'} onClick={() => setTransport('도보')}>
                  도보
                </Button>
                <Button colorScheme={transport === '자동차' ? 'blue' : 'gray'} onClick={() => setTransport('자동차')}>
                  자동차
                </Button>
              </HStack>
            </VStack>
            <VStack align="stretch">
              <Text>현재 위치가 어디인가요?</Text>
              <LocationPicker />
            </VStack>
          </VStack>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            맞춤 일정 만들기
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export default PlanInfoModal;
