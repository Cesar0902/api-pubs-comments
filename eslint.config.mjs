// eslint.config.mjs
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __dirname = dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({ baseDirectory: __dirname })

export default [
  js.configs.recommended,

  ...compat.extends('standard'),

  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module'
    },
    rules: {
      semi: ['error', 'always']
    }
  },

  { ignores: ['node_modules/**', 'docker/**'] }
]
