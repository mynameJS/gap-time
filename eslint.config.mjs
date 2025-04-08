import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginImport from 'eslint-plugin-import'; // ✅ 추가

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ✅ Next.js core rules
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // ✅ 커스텀 룰 + import/order 추가
  {
    plugins: {
      import: pluginImport, // ✅ import plugin 등록
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',

      // ✅ import 정렬 룰
      'import/order': [
        'warn',
        {
          groups: [
            'builtin', // Node.js 내장
            'external', // 외부 라이브러리
            'internal', // @ 경로 등
            'parent', // ../
            'sibling', // ./
            'index', // index.ts
            'object', // import * as ...
            'type', // import type ...
          ],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];

export default eslintConfig;
