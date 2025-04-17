import { Box, Button, IconButton, Text, VStack } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';

function PlaceAIRecommend({ onPlaceSelect }: { onPlaceSelect: any }) {
  const [mode, setMode] = useState<'closed' | 'open'>('closed');
  const [messages, setMessages] = useState<{ role: 'user' | 'gpt'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input } as const;
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
          mood: input,
        }),
      });
      const data = await res.json();
      const gptMessage = { role: 'gpt', content: data.result } as const;
      setMessages(prev => [...prev, gptMessage]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'gpt', content: '추천을 가져오는 데 실패했어요 😢' }]);
    } finally {
      setLoading(false);
    }
  };

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
            <Box
              bg="white"
              boxShadow="lg"
              p={4}
              borderRadius="lg"
              w="600px"
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

              <VStack align="stretch" gap={2} overflowY="auto" maxH="350px" mt={8}>
                {messages.map((msg, idx) => (
                  <Box
                    key={idx}
                    alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                    bg={msg.role === 'user' ? 'teal.100' : 'gray.100'}
                    px={3}
                    py={2}
                    borderRadius="md"
                    maxW="80%">
                    <Text fontSize="sm">{msg.content}</Text>
                  </Box>
                ))}
              </VStack>

              <Box mt={3}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="예: 혼자 쉬고 싶은 곳"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    marginBottom: '4px',
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <Button
                  colorScheme="teal"
                  size="sm"
                  onClick={handleSend}
                  loading={loading}
                  loadingText="생각 중..."
                  width="100%">
                  보내기
                </Button>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default PlaceAIRecommend;
