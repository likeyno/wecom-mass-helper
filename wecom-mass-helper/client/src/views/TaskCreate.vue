<template>
  <div>
    <div class="page-header">
      <h2>创建群发任务</h2>
    </div>
    <el-card>
      <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="form.taskName" placeholder="请输入任务名称" style="max-width: 400px" />
        </el-form-item>
        <el-form-item label="选择模板" prop="templateId">
          <el-select v-model="form.templateId" placeholder="选择消息模板" style="width: 400px" filterable>
            <el-option v-for="t in templates" :key="t.id" :label="t.name" :value="t.id">
              <span>{{ t.name }}</span>
              <span style="float: right; color: #909399; font-size: 12px;">{{ typeLabel(t.msgType) }}</span>
            </el-option>
          </el-select>
          <el-button style="margin-left: 12px;" @click="fetchTemplates">刷新</el-button>
        </el-form-item>
        <el-form-item v-if="selectedTemplate" label="模板预览">
          <el-card shadow="never" style="width: 400px; background: #f5f7fa;">
            <p v-if="selectedTemplate.msgType === 1"><strong>文本：</strong>{{ selectedTemplate.content }}</p>
            <p v-if="selectedTemplate.msgType === 2"><strong>图文：</strong>{{ selectedTemplate.title }}</p>
            <p v-if="selectedTemplate.msgType === 3"><strong>文件：</strong>{{ selectedTemplate.fileName }}</p>
          </el-card>
        </el-form-item>
        <el-form-item label="目标群聊" prop="groupIds">
          <el-input
            v-model="groupInput"
            placeholder="输入群ChatId，回车添加（多个群请逐个添加）"
            style="max-width: 400px"
            @keyup.enter="addGroup"
          />
          <el-button style="margin-left: 12px;" @click="addGroup" :disabled="!groupInput">添加</el-button>
        </el-form-item>
        <el-form-item v-if="form.groupIds.length > 0">
          <el-tag
            v-for="(gid, idx) in form.groupIds"
            :key="idx"
            closable
            style="margin: 4px;"
            @close="removeGroup(idx)"
          >
            {{ gid }}
          </el-tag>
        </el-form-item>
        <el-form-item label="发送方式">
          <el-radio-group v-model="sendType">
            <el-radio :value="'now'">立即发送</el-radio>
            <el-radio :value="'schedule'">定时发送</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="sendType === 'schedule'" label="定时时间" prop="sendTime">
          <el-date-picker
            v-model="form.sendTime"
            type="datetime"
            placeholder="选择发送时间"
            :disabled-date="disabledDate"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting" size="large">创建任务</el-button>
          <el-button @click="\.back()" size="large">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getTemplateList } from '../api/template'
import { createTask } from '../api/task'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref(null)
const submitting = ref(false)
const templates = ref([])
const groupInput = ref('')
const sendType = ref('now')

const form = ref({
  taskName: '',
  templateId: null,
  groupIds: [],
  sendTime: null,
})

const rules = {
  taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  templateId: [{ required: true, message: '请选择消息模板', trigger: 'change' }],
}

const selectedTemplate = computed(() => {
  return templates.value.find(t => t.id === form.value.templateId)
})

const typeLabel = (t) => ({ 1: '文本', 2: '图文', 3: '文件' }[t] || '未知')

const disabledDate = (time) => time.getTime() < Date.now()

const addGroup = () => {
  const val = groupInput.value.trim()
  if (val && !form.value.groupIds.includes(val)) {
    form.value.groupIds.push(val)
  }
  groupInput.value = ''
}

const removeGroup = (idx) => {
  form.value.groupIds.splice(idx, 1)
}

const fetchTemplates = async () => {
  try {
    const res = await getTemplateList({ page: 1, pageSize: 100 })
    templates.value = res.data.list
  } catch {}
}

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  if (form.value.groupIds.length === 0) {
    ElMessage.warning('请至少添加一个目标群')
    return
  }
  submitting.value = true
  try {
    const payload = {
      ...form.value,
      sendTime: sendType.value === 'now' ? null : form.value.sendTime,
    }
    await createTask(payload)
    ElMessage.success('任务创建成功')
    router.push('/tasks')
  } finally {
    submitting.value = false
  }
}

fetchTemplates()
</script>
