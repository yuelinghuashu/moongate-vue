import Button from './components/Button.vue'
import Card from './components/Card.vue'
import Badge from './components/Badge.vue'
import Divider from './components/Divider.vue'
import Input from './components/Input.vue'
import Textarea from './components/Textarea.vue'
import Checkbox from './components/Checkbox.vue'
import Radio from './components/Radio.vue'
import Switch from './components/Switch.vue'
import Select from './components/Select.vue'
import Pagination from './components/Pagination.vue'
import Modal from './components/Modal.vue'
import Toast from './components/Toast.vue'
import Message from './components/Message.vue'
import Tabs from './components/Tabs.vue'
import Skeleton from './components/Skeleton.vue'
import Tooltip from './components/Tooltip.vue'
import Container from './components/Container.vue'
import Header from './components/Header.vue'
import Main from './components/Main.vue'
import Footer from './components/Footer.vue'
import Hero from './components/Hero.vue'
import Popover from './components/Popover.vue'
import Drawer from './components/Drawer.vue'
import Table from './components/Table.vue'
import Form from './components/Form.vue'
import FormItem from './components/FormItem.vue'
import Dropdown from './components/Dropdown.vue'
import SeriesNav from './components/SeriesNav.vue'

import { useToast } from './composables/useToast'
import { useMessage } from './composables/useMessage'
import { useForm } from './composables/useForm'
import { useMenuKeyboard } from './composables/useMenuKeyboard'

import './styles/index.css'

export { setConfig, resetConfig, disposeConfig } from './config'
export type { Config, LocaleTexts } from './config'

export {
  Button,
  Card,
  Badge,
  Divider,
  Input,
  Textarea,
  Checkbox,
  Radio,
  Switch,
  Select,
  Pagination,
  Modal,
  Toast,
  Message,
  Tabs,
  Skeleton,
  Tooltip,
  Table,
  Form,
  FormItem,
  Container,
  Header,
  Main,
  Footer,
  Hero,
  Popover,
  Drawer,
  Dropdown,
  SeriesNav,
  useToast,
  useMessage,
  useForm,
  useMenuKeyboard,
}

export type { Rule, FieldRules, UseFormOptions } from './composables/useForm'
export type { MenuItemBase } from './composables/useMenuKeyboard'

// Table 组件类型（泛型组件需要单独导出类型）
export type {
  TableColumn,
  SortParams,
  CellSlotProps,
  ColumnSlotProps,
  TableProps,
} from './types/table'

// Form 组件类型（泛型组件需要单独导出类型）
export type { FormProps } from './types/form'

// Dropdown 组件类型
export type { DropdownOption, DropdownPlacement } from './types/components'

// SeriesNav 组件类型
export type { SeriesNavItem } from './types/components'

// ==================== 组件 Props 类型 ====================
export type {
  ButtonProps,
  CardProps,
  BadgeProps,
  DividerProps,
  InputProps,
  TextareaProps,
  CheckboxProps,
  RadioProps,
  SwitchProps,
  SelectProps,
  SelectValue,
  SelectOption,
  PaginationProps,
  ModalProps,
  ToastProps,
  MessageProps,
  TabsProps,
  TabItem,
  SkeletonProps,
  TooltipProps,
  PopoverProps,
  DrawerProps,
  ContainerProps,
  HeaderProps,
  HeroProps,
  DropdownProps,
  FormItemProps,
  SeriesNavProps,
} from './types/props'
