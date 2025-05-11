import { Input, Button, InputProps, Icon } from '@chakra-ui/react';
import { useState } from 'react';
import { IoMdEye, IoIosEyeOff } from 'react-icons/io';
import { InputGroup } from '@/components/ui/input-group';

export default function PasswordInput(props: InputProps) {
  const [showPw, setShowPw] = useState(false);

  const toggleShowPw = () => setShowPw(prev => !prev);

  return (
    <InputGroup
      w="100%"
      endElement={
        <Button
          h="1.75rem"
          size="sm"
          variant="ghost"
          minW="auto"
          p={0}
          onClick={toggleShowPw}
          aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
          tabIndex={-1}>
          <Icon as={showPw ? IoIosEyeOff : IoMdEye} boxSize={5} />
        </Button>
      }>
      <Input type={showPw ? 'text' : 'password'} {...props} />
    </InputGroup>
  );
}
