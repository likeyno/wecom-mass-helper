<template>
  <div>
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
      <h2>任务详情</h2>
      <el-button @click="\.back()">返回</el-button>
    </div>

    <el-card v-if="task" style="margin-bottom: 16px;">
      <template #header>基本信息</template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="任务名称">{{ task.taskName }}</el-descriptions-item>
        <el-descriptions-item label="使用模板">{{ task.template?.name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="发送状态">
          <el-tag :type="statusType(task.status)" size="small">{{ statusLabel(task.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="目标群数">{{ task.totalCount }}</el-descriptions-item>
        <el-descriptions-item label="发送成功">{{ task.successCount }}</el-descriptions-item>
        <el-descriptions-item label="发送失败">{{ task.failCount }}</el-descriptions-item>
        <el-descriptions-item label="发送时间">
          {{ task.sendTime ? task.sendTime : '立即发送' }}
        </el-descriptions-item>
        <el-descriptions-item label="完成时间">{{ task.completedAt || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ task.creator || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ task.createdAt }}</el-descriptions-item>
      </el-descriptions>
      <div style="margin-top: 16px;" v-if="task.status === 3 || task.status === 4">
        <el-button type="warning" @click="handleRetry" :loading="retrying">重试失败记录</el-button>
      </div>
    </el-card>

    <el-card v-loading="loading">
      <template #header>发送记录</template>
      <el-table :data="records" stripe style="width: 100%">
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="chatId" label="群聊ID" min-width="200" />
        <el-table-column prop="groupName" label="群名称" min-width="160" />
        <el-table-column label="发送状态" width="120">
          <template #default="{ row }">
            <el-tag :type="recStatusType(row.status)" size="small">{{ recStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="errorMsg" label="失败原因" min-width="200">
          <template #default="{ row }">
            <span style="color: #f56c6c;">{{ row.errorMsg || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="retryCount" label="重试次数" width="100" />
        <el-table-column prop="sentAt" label="发送时间" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getTaskDetail, retryTask } from '../api/task'
import { ElMessage } from 'element-plus'

const route = useRoute()
const task = ref(null)
const records = ref([])
const loading = ref(false)
const retrying = ref(false)

const statusType = (s) => ({ 0: 'info', 1: 'warning', 2: 'success', 3: 'danger', 4: 'danger' }[s] || 'info')
const statusLabel = (s) => ({ 0: '待发送', 1: '发送中', 2: '已完成', 3: '部分失败', 4: '失败' }[s] || '未知')
const recStatusType = (s) => ({ 0: 'info', 1: 'success', 2: 'danger' }[s] || 'info')
const recStatusLabel = (s) => ({ 0: '待发送', 1: '已发送', 2: '失败' }[s] || '未知')

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getTaskDetail(route.params.id)
    task.value = res.data
    records.value = res.data.records || []
  } finally {
    loading.value = false
  }
}

const handleRetry = async () => {
  retrying.value = true
  try {
    const res = await retryTask(route.params.id)
    ElMessage.success(重试完成，剩余  条失败记录)
    fetchData()
  } finally {
    retrying.value = false
  }
}

onMounted(fetchData)
</script>
