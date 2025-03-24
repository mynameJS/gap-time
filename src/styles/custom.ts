import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

// 커스텀 전역 CSS 세팅

const customConfig = defineConfig({
  globalCss: {
    // ✅ 스크롤바 커스텀
    '::-webkit-scrollbar': {
      width: '6px',
      height: '6px',
    },
    '::-webkit-scrollbar-thumb': {
      background: '#CBD5E0', // gray.300
      borderRadius: '8px',
    },
    '::-webkit-scrollbar-track': {
      background: '#EDF2F7', // gray.100
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
