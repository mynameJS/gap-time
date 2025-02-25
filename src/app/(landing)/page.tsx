import { Box, Flex, Text } from '@chakra-ui/react';
import CustomButton from './components/CustomButton';

export default async function Page() {
  return (
    <Box borderWidth="3px" height="90%" borderColor="black">
      <Flex align="center" borderWidth="3px" height="100%" width="100%">
        <Flex flexDirection="column" borderWidth={3} gap={10} width="50%" height="100%" justifyContent="center">
          <Box>
            <Text textStyle="6xl" fontWeight="bold" lineHeight="100px">
              하루 중 틈새시간을 <br />
              이용하는 일정 플래너
            </Text>
            <Text>자투리 시간에 뭐할까 고민하지말고 틈새시간을 이용해보세요.</Text>
          </Box>
          <CustomButton path="/plan">틈새시간 이용하기</CustomButton>
        </Flex>
        <Box borderWidth="3px" width="50%" height="100%">
          비디오 영역
        </Box>
      </Flex>
    </Box>
  );
}
