import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

// reset css 세팅

const customConfig = defineConfig({
  globalCss: {
    html: {
      fontSize: '602.5%',
    },
    body: {
      lineHeight: '1',
    },
    /* CSS Reset */
    '*': {
      padding: 0,
      margin: 0,
      font: 'inherit',
      fontSize: '100%',
      verticalAlign: 'baseline',
      border: '0',
      boxSizing: 'border-box',
    },
    /* HTML5 display-role reset for older browsers */
    article: { display: 'block' },
    aside: { display: 'block' },
    details: { display: 'block' },
    figcaption: { display: 'block' },
    figure: { display: 'block' },
    footer: { display: 'block' },
    header: { display: 'block' },
    hgroup: { display: 'block' },
    menu: { display: 'block' },
    nav: { display: 'block' },
    section: { display: 'block' },
    ol: {
      listStyle: 'none',
    },
    ul: {
      listStyle: 'none',
    },
    blockquote: {
      quotes: 'none',
    },
    'blockquote::before': {
      content: "''",
    },
    'blockquote::after': {
      content: "''",
    },
    'q::before': {
      content: "''",
    },
    'q::after': {
      content: "''",
    },
    table: {
      borderSpacing: '0',
      borderCollapse: 'collapse',
    },
    button: {
      cursor: 'pointer',
      border: 'none',
    },
    a: {
      textDecoration: 'none',
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
