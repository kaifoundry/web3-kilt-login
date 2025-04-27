// // @ts-check

// import eslint from '@eslint/js';
// import tseslint from 'typescript-eslint';

// export default tseslint.config(
//   eslint.configs.recommended,
//   tseslint.configs.recommended,
// );

// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/*.config.js',
      '**/*.config.ts',

    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    }
  },
  
  eslint.configs.recommended,
  tseslint.configs.recommended,
);
