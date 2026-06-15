<template>
  <div>
    <div class="page-header">
      <h2>工作台</h2>
    </div>
    <div class="stat-cards">
      <el-card shadow="hover">
        <div class="stat-item">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">总任务数</div>
        </div>
      </el-card>
      <el-card shadow="hover">
        <div class="stat-item">
          <div class="stat-value" style="color: #67c23a">{{ stats.completed }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </el-card>
      <el-card shadow="hover">
        <div class="stat-item">
          <div class="stat-value" style="color: #e6a23c">{{ stats.pending }}</div>
          <div class="stat-label">待发送</div>
        </div>
      </el-card>
      <el-card shadow="hover">
        <div class="stat-item">
          <div class="stat-value" style="color: #f56c6c">{{ stats.failed }}</div>
          <div class="stat-label">失败/部分失败</div>
        </div>
      </el-card>
    </div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>快捷操作</span>
        </div>
      </template>
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <el-button type="primary" size="large" @click="\.push('/tasks/create')">
          <el-icon><Plus /></el-icon> 新建群发任务
        </el-button>
        <el-button size="large" @click="\.push('/templates')">
          <el-icon><Document /></el-icon> 管理消息模板
        </el-button>
        <el-button size="large" @click="\.push('/tasks')">
          <el-icon><List /></el-icon> 查看任务记录
        </el-button>
      </div>
    </el-card>
    <el-card style="margin-top: 16px;">
      <template #header>
        <div class="card-header">
          <span>最近任务</span>
        </div>
      </template>
      <el-table :data="recentTasks" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="taskName" label="任务名称" min-width="160" />
        <el-table-column label="使用模板" min-width="140">
          <template #default="{ row }">
            {{ row.template?.name || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="totalCount" label="目标群数" width="100" />
        <el-table-column label="发送状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="\.push('/tasks/' + row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTaskList } from '../api/task'

const stats = ref({ total: 0, completed: 0, pending: 0, failed: 0 })
const recentTasks = ref([])
const loading = ref(false)

const statusType = (s) => ({ 0: 'info', 1: 'warning', 2: 'success', 3: 'danger', 4: 'danger' }[s] || 'info')
const statusLabel = (s) => ({ 0: '待发送', 1: '发送中', 2: '已完成', 3: '部分失败', 4: '失败' }[s] || '未知')

onMounted(async () => {
  loading.value = true
  try {
    const res = await getTaskList({ page: 1, pageSize: 5 })
    recentTasks.value = res.data.list
    stats.value.total = res.data.total
    stats.value.completed = res.data.list.filter(t => t.status === 2).length
    stats.value.pending = res.data.list.filter(t => t.status === 0 || t.status === 1).length
    stats.value.failed = res.data.list.filter(t => t.status === 3 || t.status === 4).length
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.stat-item {
  text-align: center;
  padding: 8px 0;
}
.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #409eff;
}
.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
