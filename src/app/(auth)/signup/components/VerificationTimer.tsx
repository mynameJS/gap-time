import { Text } from '@chakra-ui/react';

interface Props {
  seconds: number;
}

export default function VerificationTimer({ seconds }: Props) {
  const minutes = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, '0');

  return (
    <Text fontSize="12px" color="red.500" whiteSpace="nowrap">
      {minutes}:{secs}
    </Text>
  );
}
