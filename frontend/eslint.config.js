import js from '@eslint/js'
import vitestPlugin from '@vitest/eslint-plugin'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{test,spec}.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      // Añade o personaliza reglas de testing
      'vitest/max-nested-describe': ['error', { max: 3 }],
    },
  },
]
