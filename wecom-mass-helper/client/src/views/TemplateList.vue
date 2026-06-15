<template>
  <div>
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
      <h2>消息模板管理</h2>
      <el-button type="primary" @click="showCreate">新建模板</el-button>
    </div>

    <el-card>
      <el-table :data="list" stripe style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="name" label="模板名称" min-width="160" />
        <el-table-column label="消息类型" width="120">
          <template #default=\"{ row }\">
            <el-tag :type=\"['', '', 'warning', 'success'][row.msgType]\" size=\"small\">{{ ['', '文本', '图文', '文件'][row.msgType] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="内容预览" min-width="300">
          <template #default=\"{ row }\">
            <span v-if=\"row.msgType === 1\">{{ row.content?.substring(0, 50) }}</span>
            <span v-else-if=\"row.msgType === 2\">{{ row.title }}</span>
            <span v-else-if=\"row.msgType === 3\">{{ row.fileName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop=\"createdAt\" label=\"创建时间\" width=\"180\" />
        <el-table-column label=\"操作\" width=\"200\">
          <template #default=\"{ row }\">
            <el-button type=\"primary\" link @click=\"handleEdit(row)\">编辑</el-button>
            <el-button type=\"danger\" link @click=\"handleDelete(row)\">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTemplateList, deleteTemplate } from '../api/template'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const list = ref([])
const loading = ref(false)

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getTemplateList({ page: 1, pageSize: 100 })
    list.value = res.data.list
  } finally {
    loading.value = false
  }
}

const showCreate = () => {
  router.push('/templates/create')
}

const handleEdit = (row) => {
  router.push('/templates/' + row.id)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除该模板吗？', '提示', { type: 'warning' })
    await deleteTemplate(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch {}
}

onMounted(fetchList)
</script>
