import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/coverage/**', '**/docs/.vitepress/**', 'node_modules/**'],
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,

  {
    name: 'app/component-library-rules',
    rules: {
      // 组件库惯例：单名组件（Button/Modal/Toast 等）是必需的，与 HTML 元素重名也正常
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',

      // 表驱动/泛型组件的 any 是合理设计（Table/Select 的泛型插槽）
      '@typescript-eslint/no-explicit-any': 'off',

      // shims-vue.d.ts 的模块声明需要空对象类型
      '@typescript-eslint/no-empty-object-type': 'off',

      // 组件库 props 常需要声明后备用（如 defineProps 的 props 变量），放宽未使用警告
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^props$', argsIgnorePattern: '^_' },
      ],
    },
  },

  // 测试文件：挂载副作用为主，未使用的 wrapper/instance 是常见模式
  {
    name: 'app/test-rules',
    files: ['src/__tests__/**/*.test.ts', 'src/__tests__/setup.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
)
