'use client';

import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface CustomButtonProps {
  path: string;
  children: ReactNode;
}

export default function CustomButton({ path, children }: CustomButtonProps) {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push(path);
  };

  return (
    <Button
      onClick={handleButtonClick}
      width="
          20%">
      {children}
    </Button>
  );
}
