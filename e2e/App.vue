<script setup lang="ts">
import { ref } from 'vue'
import {
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
  Tabs,
  Skeleton,
  Tooltip,
  Popover,
  Drawer,
  Table,
  Container,
  Header,
  Main,
  Footer,
  Hero,
  Dropdown,
  Form,
  FormItem,
} from '../src/index'
import '../src/styles/index.css'
import '../src/styles/reset.css'

// ==================== 状态 ====================
const modalOpen = ref(false)
const drawerOpen = ref(false)
const page = ref(1)
const selectedFruits = ref<Array<string | number>>([])
const selectedRows = ref<Record<string, any>[]>([])
const activeTab = ref<number>(0)
const dropdownKey = ref('')

const dropdownOptions = [
  { key: 'edit', label: '编辑' },
  { key: 'copy', label: '复制' },
  { key: '__sep__', separator: true as const },
  { key: 'delete', label: '删除', danger: true },
]

const tabs = [
  { label: '标签一', content: '标签一内容' },
  { label: '标签二', content: '标签二内容' },
  { label: '标签三', content: '标签三内容' },
]

const tableColumns = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' },
]

const tableData = [
  { id: 1, name: '张三', age: 28 },
  { id: 2, name: '李四', age: 22 },
  { id: 3, name: '王五', age: 35 },
]
</script>

<template>
  <div class="e2e-playground" style="padding: 24px; display: grid; gap: 24px; max-width: 900px">
    <!-- 基础组件 -->
    <section data-testid="basic">
      <h2>基础组件</h2>
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center">
        <Button label="按钮" data-testid="btn" />
        <Button variant="outline" color="success" label="成功" />
        <Badge label="徽章" />
        <Divider style="width: 100%" />
        <Card hoverable style="padding: 16px">卡片内容</Card>
      </div>
    </section>

    <!-- 表单组件 -->
    <section data-testid="form">
      <h2>表单组件</h2>
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center">
        <Input placeholder="输入框" data-testid="input" style="width: 200px" />
        <Textarea placeholder="多行文本" rows="2" style="width: 200px" />
        <Checkbox label="复选框" />
        <Radio label="单选项" value="a" model-value="a" />
        <Switch label="开关" />
        <Select
          v-model="selectedFruits"
          :options="['苹果', '香蕉', '橙子']"
          filterable
          multiple
          placeholder="多选水果"
          style="width: 220px"
          data-testid="select"
        />
      </div>
    </section>

    <!-- 数据展示 -->
    <section data-testid="data">
      <h2>数据展示</h2>
      <Table
        v-model:selected-rows="selectedRows"
        :columns="tableColumns"
        :data="tableData"
        row-key="id"
        selectable
        style="margin-bottom: 12px"
        data-testid="table"
      />
      <Pagination v-model="page" :total-pages="10" data-testid="pagination" />
      <Tabs v-model="activeTab" :tabs="tabs" data-testid="tabs" />
      <Skeleton :rows="3" style="margin-top: 12px" />
    </section>

    <!-- 表单 -->
    <section data-testid="form-section">
      <h2>表单</h2>
      <Form :errors="{ username: '用户名不能为空' }" label-width="80px" style="max-width: 320px">
        <FormItem name="username" label="用户名" required>
          <Input placeholder="请输入用户名" />
        </FormItem>
      </Form>
    </section>

    <!-- 下拉菜单 -->
    <section data-testid="dropdown-section">
      <h2>下拉菜单</h2>
      <Dropdown
        :options="dropdownOptions"
        data-testid="dropdown"
        @select="
          (k) => {
            dropdownKey = k
          }
        "
      >
        <Button label="操作菜单" />
      </Dropdown>
      <span v-if="dropdownKey" data-testid="dropdown-result" style="margin-left: 12px">
        已选: {{ dropdownKey }}
      </span>
    </section>

    <!-- 布局组件 -->
    <section data-testid="layout">
      <h2>布局组件</h2>
      <Container size="sm" style="border: 1px solid var(--ui-border); padding: 8px">
        <Header style="border: 1px solid var(--ui-border); padding: 4px">头部</Header>
        <Main style="border: 1px solid var(--ui-border); padding: 4px">主体</Main>
        <Footer style="border: 1px solid var(--ui-border); padding: 4px">底部</Footer>
      </Container>
      <Hero title="英雄区标题" description="英雄区描述" style="margin-top: 12px" />
    </section>

    <!-- 反馈组件 -->
    <section data-testid="feedback">
      <h2>反馈组件</h2>
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center">
        <Button label="打开弹窗" @click="modalOpen = true" data-testid="open-modal" />
        <Button
          variant="outline"
          label="打开抽屉"
          @click="drawerOpen = true"
          data-testid="open-drawer"
        />
        <Tooltip content="提示内容" data-testid="tooltip">
          <Button variant="outline" label="悬停提示" />
        </Tooltip>
        <Popover content="弹出层内容">
          <Button variant="outline" label="悬停弹出" />
        </Popover>
      </div>
    </section>

    <!-- 浮层 -->
    <Modal v-model="modalOpen" title="模态框标题" data-testid="modal">模态框内容</Modal>
    <Drawer v-model="drawerOpen" title="抽屉标题" data-testid="drawer">抽屉内容</Drawer>

    <!-- 样式工具 -->
    <section data-testid="utilities">
      <h2>样式工具</h2>
      <span class="mg-link">链接样式</span>
      <code class="mg-code-inline">code</code>
    </section>
  </div>
</template>
