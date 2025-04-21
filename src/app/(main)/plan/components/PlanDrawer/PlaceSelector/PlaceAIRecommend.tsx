import { Box, Button, Flex, IconButton, Input, Text, VStack, HStack, Icon } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { TbBulb } from 'react-icons/tb';
import { InputGroup } from '@/components/ui/input-group';
import { getRecommendedPlacesByPrompt } from '@/lib/api/openai/openai';
import usePlanStore from '@/store/usePlanInfoStore';
import { ChatMessage, PlaceDetails } from '@/types/interface';
import { getIntroReply, getClosingReply } from '@/utils/getRandomGptReply';
import { RecommendedPlaceCard } from './RecommendedPlaceCard';

interface PlaceAIRecommendProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  selectedPlaces: PlaceDetails[];
}

function PlaceAIRecommend({ onPlaceSelect, selectedPlaces }: PlaceAIRecommendProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'closed' | 'open'>('closed');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState<string | null>(null);
  const { planInfo } = usePlanStore();

  const handleSend = async () => {
    const message = input.trim();
    if (!message || !planInfo) return;

    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setInput('');
    setLoading(true);

    try {
      const places = await getRecommendedPlacesByPrompt(message, planInfo.geocode.lat, planInfo.geocode.lng);
      if (!places || places.length === 0) throw new Error('추천 장소를 찾을 수 없습니다.');

      const intro = getIntroReply(message);
      const closing = getClosingReply();

      // GPT 응답 시 타이핑 효과로 메시지 순차 출력
      setTypingMessage('');
      const fullMessage = intro;
      let i = 0;
      const interval = setInterval(() => {
        setTypingMessage(prev => (prev || '') + fullMessage[i]);
        i++;
        if (i >= fullMessage.length) {
          clearInterval(interval);
          setMessages(prev => [
            ...prev,
            { role: 'gpt', content: intro },
            { role: 'gpt', content: places },
            { role: 'gpt', content: closing },
          ]);
          setTypingMessage(null);
          setLoading(false);
        }
      }, 30);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('AI 추천 실패:', e.message);
      } else {
        console.error('AI 추천 알 수 없는 오류:', e);
      }
      setMessages(prev => [...prev, { role: 'gpt', content: '추천 장소를 찾을 수 없어요 😢' }]);
      setLoading(false);
    }
  };

  // 새로운 메세지 추가 시 스크롤 하단
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingMessage]);

  // AI추천 채팅 OPEN 시 스크롤 하단
  useEffect(() => {
    if (mode === 'open') {
      const scrollToBottom = () => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      };

      // ChakraUI 렌더방식으로 인해 ref 참조 시 DOM 연동이 늦어 확실한 보장을 위해 타임아웃 3번 실행 (개선필요)
      const timeouts = [
        setTimeout(scrollToBottom, 200),
        setTimeout(scrollToBottom, 500),
        setTimeout(scrollToBottom, 1000),
      ];

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [mode]);

  return (
    <Box position="fixed" bottom="7" right="6" zIndex="1400">
      <AnimatePresence mode="wait">
        {mode === 'closed' ? (
          <motion.div
            key="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}>
            <Button colorScheme="teal" onClick={() => setMode('open')}>
              AI 추천
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}>
            <VStack
              bg="white"
              boxShadow="lg"
              p={4}
              borderRadius="lg"
              w={{ base: '90vw', md: '600px' }}
              h={{ base: '400px', md: '500px' }}
              overflow="hidden"
              position="relative">
              <IconButton
                aria-label="Close AI"
                size="sm"
                position="absolute"
                top={2}
                right={2}
                onClick={() => setMode('closed')}
                variant="ghost">
                <RxCross2 />
              </IconButton>

              <VStack ref={scrollRef} align="stretch" gap={2} overflowY="auto" w="100%" h="400px" mt={8}>
                {messages.length === 0 && (
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    px={4}
                    py={6}
                    w="100%"
                    h="100%"
                    bg="gray.50"
                    borderRadius="md">
                    <Box fontSize="40px" mb={4} color="gray.400">
                      <Icon as={TbBulb} />
                    </Box>
                    <Text fontSize="sm" fontWeight="500" color="gray.500" textAlign="center">
                      원하는 분위기나 조건을 입력하면
                      <br />
                      AI가 어울리는 장소를 추천해드려요.
                    </Text>
                    <Text fontSize="sm" color="gray.500" mt={3} textAlign="center">
                      예: <b>&quot;조용한 카페&quot;</b> 또는 <b>&quot;30분 안에 다녀올 산책 코스&quot;</b>
                    </Text>
                  </Flex>
                )}

                {messages.map((msg, idx) => {
                  if (msg.role === 'user') {
                    return (
                      <Box key={idx} alignSelf="flex-end" bg="green.100" px={3} py={2} borderRadius="md" maxW="80%">
                        <Text fontSize="sm">{msg.content as string}</Text>
                      </Box>
                    );
                  }
                  if (Array.isArray(msg.content)) {
                    return (
                      <HStack key={idx} gap={3} w="max-content" px={1} alignSelf="flex-start">
                        {msg.content.map(place => (
                          <RecommendedPlaceCard
                            key={place.place_id}
                            place={place}
                            onSelect={onPlaceSelect}
                            isSelected={selectedPlaces.some(p => p.place_id === place.place_id)}
                          />
                        ))}
                      </HStack>
                    );
                  }
                  return (
                    <Box key={idx} alignSelf="flex-start" bg="gray.100" px={3} py={2} borderRadius="md" maxW="80%">
                      <Text fontSize="sm">{msg.content as string}</Text>
                    </Box>
                  );
                })}

                {typingMessage && (
                  <Box alignSelf="flex-start" bg="gray.100" px={3} py={2} borderRadius="md" maxW="80%">
                    <Text fontSize="sm">{typingMessage}</Text>
                  </Box>
                )}
              </VStack>

              <InputGroup
                mt={2}
                w="100%"
                endElementProps={{ p: 0 }}
                endElement={
                  <Button
                    type="button"
                    colorPalette="teal"
                    w="50px"
                    minW="auto"
                    p={0}
                    size="sm"
                    onClick={handleSend}
                    loading={loading}>
                    전송
                  </Button>
                }>
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="원하는 장소의 유형을 입력해 주세요!"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
              </InputGroup>
            </VStack>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default PlaceAIRecommend;
