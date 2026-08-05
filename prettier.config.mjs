/** @type {import('prettier').Config} */
export default {
  // 单引号（统一工具/组件的引号风格，消除 Button 双引号 vs Tooltip 单引号的混用）
  singleQuote: true,
  // 语句末尾分号
  semi: false,
  // 去掉对象/数组最后一项后的逗号
  trailingComma: 'all',
  // 每行最大宽度
  printWidth: 100,
  // 缩进 2 空格
  tabWidth: 2,
  // 使用空格而非 tab
  useTabs: false,
  // 箭头函数参数括号：仅当必要时（a => a，不包裹单参数）
  arrowParens: 'always',
  // 对象大括号两侧加空格
  bracketSpacing: true,
  // Vue 文件中的脚本/样式块末标签换行（> 独立一行）
  vueIndentScriptAndStyle: false,
  // 换行符
  endOfLine: 'lf',
  // HTML 空白敏感度
  htmlWhitespaceSensitivity: 'ignore',
  // 是否给 Markdown 文本自动换行
  proseWrap: 'preserve',
}
