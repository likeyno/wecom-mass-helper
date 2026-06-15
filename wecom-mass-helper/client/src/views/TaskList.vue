<template>
  <div>
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
      <h2>群发任务</h2>
      <el-button type="primary" @click="\.push('/tasks/create')">
        <el-icon><Plus /></el-icon> 新建任务
      </el-button>
    </div>

    <el-card>
      <el-table :data="tasks" v-loading="loading" stripe style="width: 100%">
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="taskName" label="任务名称" min-width="160" />
        <el-table-column label="使用模板" min-width="120">
          <template #default="{ row }">{{ row.template?.name || '-' }}</template>
        </el-table-column>
        <el-table-column prop="totalCount" label="目标群数" width="100" />
        <el-table-column label="发送结果" width="160">
          <template #default="{ row }">
            <span>成功 {{ row.successCount }} / 失败 {{ row.failCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发送状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发送时间" width="160">
          <template #default="{ row }">
            {{ row.sendTime ? row.sendTime : '立即发送' }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="\.push('/tasks/' + row.id)">详情</el-button>
            <el-button v-if="row.status === 3 || row.status === 4" type="warning" link size="small" @click="handleRetry(row.id)">重试</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 16px; text-align: right;">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="fetchData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTaskList, retryTask } from '../api/task'
import { ElMessage } from 'element-plus'

const tasks = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

const statusType = (s) => ({ 0: 'info', 1: 'warning', 2: 'success', 3: 'danger', 4: 'danger' }[s] || 'info')
const statusLabel = (s) => ({ 0: '待发送', 1: '发送中', 2: '已完成', 3: '部分失败', 4: '失败' }[s] || '未知')

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getTaskList({ page: page.value, pageSize: pageSize.value })
    tasks.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

const handleRetry = async (id) => {
  await retryTask(id)
  ElMessage.success('重试任务已提交')
  fetchData()
}

onMounted(fetchData)
</script>
