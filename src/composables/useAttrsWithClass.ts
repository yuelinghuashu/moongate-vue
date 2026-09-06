// composables/useAttrsWithClass.ts
import { useAttrs, computed, toValue } from 'vue'

/**
 * 可接受的类名类型：字符串、数组、或者对象（键为类名，值为布尔条件）
 */
type ClassValue = string | any[] | Record<string, boolean>

/**
 * 处理 Vue 组件的属性透传（尤其是 `class` 和 `style`），自动将外部传入的 `class`
 * 与组件内部动态类合并，同时保留其他非 `class` 属性（如 `id`, `data-*` 等）的透传。
 *
 * 该组合式函数主要用于解决以下问题：
 * - Vue 默认将非 prop 属性透传到根元素，但当根元素是 `<Teleport>` 或动态组件 `<component>` 时，
 *   透传行为可能失效或导致外部 `class` 被覆盖。
 * - 通过手动绑定 `$attrs` 并分离 `class`，确保外部样式始终生效。
 *
 * @param internalClassFactory - 返回组件内部动态类名（字符串、数组或对象）的函数。
 *                              该函数会在 `computed` 中被调用，因此可以安全地访问 `props` 等响应式数据，
 *                              并自动建立依赖关系。
 *                              例如：`() => ({ 'mg-card-hoverable': props.hoverable })`
 * @param deps - 可选，额外的依赖数组，用于手动触发 `internalClassFactory` 的重新计算。
 *              通常不需要传递，因为 `computed` 会自动收集内部访问的响应式依赖。
 * @returns 返回一个对象，包含：
 *          - `attrsWithoutClass`: 除 `class` 之外的所有其他 `$attrs` 属性，可透传给组件根元素。
 *          - `mergedClass`: 合并外部 `class` 与内部类名后的最终类名（`ComputedRef`），可直接用于 `:class` 绑定。
 *
 * @example
 * ```vue
 * <script setup>
 * import { useAttrsWithClass } from '@/composables/useAttrsWithClass'
 *
 * const props = defineProps<{ active?: boolean }>()
 *
 * const { attrsWithoutClass, mergedClass } = useAttrsWithClass(() => ({
 *   'base-class': true,
 *   'active-class': props.active,
 * }))
 * </script>
 *
 * <template>
 *   <div v-bind="attrsWithoutClass" :class="mergedClass">
 *     <!-- 内容 -->
 *   </div>
 * </template>
 * ```
 */
export function useAttrsWithClass(internalClassFactory: () => ClassValue) {
  // useAttrs() 返回共享的响应式代理（当前组件实例的 attrs）。
  // 注意必须在 setup 作用域同步调用，不能放进 computed ——
  // 但返回的 proxy 本身是响应式的，在 computed 里读取其属性即可建立依赖。
  const attrs = useAttrs()

  // 外部 class（响应式读取）
  const externalClass = computed(() => attrs.class as ClassValue | undefined)

  // 除 class 外的其它 attrs：通过 for...in 逐键读取，保持响应式；
  // （运行时 attrs 是普通对象，但 Vue 的渲染会把 attrs 保持为响应式代理，
  // 逐键访问会建立依赖追踪，父组件新增/修改属性会触发 computed 重算）
  const attrsWithoutClass = computed(() => {
    const result: Record<string, unknown> = {}
    for (const key in attrs) {
      if (key === 'class') continue
      result[key] = attrs[key]
    }
    return result
  })

  // 内部 class（由工厂函数生成，随其依赖响应式变化）
  const internalClass = computed(() => internalClassFactory())

  // 合并外部 class 和内部 class
  // 使用 toValue 解包 internalClass（虽然它是 ComputedRef，但为了统一处理直接使用 toValue 也很安全）
  const mergedClass = computed(() => [externalClass.value, toValue(internalClass)])

  // 返回需要绑定到组件根元素上的属性和合并后的 class
  // （模板 v-bind="attrsWithoutClass" 会自动解包 ComputedRef）
  return {
    attrsWithoutClass,
    mergedClass,
  }
}
