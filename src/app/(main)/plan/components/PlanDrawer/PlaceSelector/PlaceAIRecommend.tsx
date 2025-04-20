import { Box, Button, IconButton, Input, Text, VStack } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { InputGroup } from '@/components/ui/input-group';
import { GPTMessage } from '@/types/interface';

function PlaceAIRecommend({ onPlaceSelect }: { onPlaceSelect: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'closed' | 'open'>('closed');
  const [messages, setMessages] = useState<GPTMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;

    const userMessage = { role: 'user', content: message } as GPTMessage;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: '서울 노원구',
          timeLimit: 60,
          mood: message, // ✅ 여기도 지역 변수 사용
        }),
      });
      const data = await res.json();
      const gptMessage = { role: 'gpt', content: data.result } as GPTMessage;
      setMessages(prev => [...prev, gptMessage]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'gpt', content: '추천을 가져오는 데 실패했어요 😢' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box position="fixed" bottom="6" right="6" zIndex="1400">
      <AnimatePresence mode="wait">
        {mode === 'closed' && (
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
        )}

        {mode === 'open' && (
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
              w="600px"
              h="400px"
              maxH="500px"
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

              <VStack ref={scrollRef} align="stretch" gap={2} overflowY="auto" w="100%" h="300px" maxH="350px" mt={8}>
                {messages.map((msg, idx) => (
                  <Box
                    key={idx}
                    alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                    bg={msg.role === 'user' ? 'green.100' : 'gray.100'}
                    px={3}
                    py={2}
                    borderRadius="md"
                    maxW="80%">
                    <Text fontSize="sm">{msg.content}</Text>
                  </Box>
                ))}
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
                  placeholder="예: 혼자 쉬고 싶은 곳"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
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
