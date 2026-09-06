/**
 * 共享组件清单：所有需要独立导出入口的组件名（PascalCase）
 *
 * 被以下文件引用（新增组件时只需修改此处）：
 * - vite.config.ts — 生成每个组件的独立构建出口
 * - scripts/verify-build.ts — 验证每个组件的构建产物
 */
export const componentNames = [
  'Button',
  'Card',
  'Badge',
  'Divider',
  'Input',
  'Textarea',
  'Checkbox',
  'Radio',
  'Switch',
  'Select',
  'Pagination',
  'Modal',
  'Toast',
  'Message',
  'Tabs',
  'Skeleton',
  'Tooltip',
  'Container',
  'Header',
  'Main',
  'Footer',
  'Hero',
  'Popover',
  'Drawer',
  'Table',
  'Form',
  'FormItem',
  'Dropdown',
  'SeriesNav',
] as const

/** PascalCase → kebab-case 文件名映射 */
export const componentEntries: Record<string, string> = Object.fromEntries(
  componentNames.map((name) => [name, name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()]),
)
