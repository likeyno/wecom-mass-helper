<template>
  <div>
    <div class=\"page-header\" style=\"display: flex; justify-content: space-between; align-items: center;\">
      <h2>{{ isEdit ? '编辑模板' : '新建模板' }}</h2>
      <el-button @click=\"\.back()\">返回</el-button>
    </div>

    <el-card>
      <el-form ref=\"formRef\" :model=\"form\" :rules=\"rules\" label-width=\"100px\">
        <el-form-item label=\"模板名称\" prop=\"name\">
          <el-input v-model=\"form.name\" placeholder=\"请输入模板名称\" maxlength=\"100\" />
        </el-form-item>
        <el-form-item label=\"消息类型\" prop=\"msgType\">
          <el-radio-group v-model=\"form.msgType\">
            <el-radio :value=\"1\">文本</el-radio>
            <el-radio :value=\"2\">图文</el-radio>
            <el-radio :value=\"3\">文件</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if=\"form.msgType === 1\" label=\"文本内容\" prop=\"content\">
          <el-input v-model=\"form.content\" type=\"textarea\" :rows=\"6\" placeholder=\"请输入文本内容\" maxlength=\"5000\" />
        </el-form-item>
        <template v-if=\"form.msgType === 2\">
          <el-form-item label=\"图文标题\" prop=\"title\">
            <el-input v-model=\"form.title\" placeholder=\"请输入图文标题\" maxlength=\"200\" />
          </el-form-item>
          <el-form-item label=\"图文描述\" prop=\"description\">
            <el-input v-model=\"form.description\" type=\"textarea\" :rows=\"3\" placeholder=\"请输入图文描述\" maxlength=\"500\" />
          </el-form-item>
          <el-form-item label=\"图片URL\" prop=\"mediaIds\">
            <el-input v-model=\"picUrl\" placeholder=\"请输入图片URL\" style=\"margin-bottom: 8px\" />
            <el-button type=\"primary\" size=\"small\" @click=\"addPic\">添加图片</el-button>
            <div v-if=\"form.mediaIds.length > 0\" style=\"margin-top: 8px;\">
              <el-tag v-for=\"(url, idx) in form.mediaIds\" :key=\"idx\" closable @close=\"removePic(idx)\" style=\"margin: 2px;\">{{ url }}</el-tag>
            </div>
          </el-form-item>
        </template>
        <template v-if=\"form.msgType === 3\">
          <el-form-item label=\"文件名称\" prop=\"fileName\">
            <el-input v-model=\"form.fileName\" placeholder=\"请输入文件名称\" maxlength=\"200\" />
          </el-form-item>
          <el-form-item label=\"文件URL\" prop=\"fileUrl\">
            <el-input v-model=\"form.fileUrl\" placeholder=\"请输入文件URL\" maxlength=\"500\" />
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type=\"primary\" @click=\"handleSubmit\" :loading=\"submitting\">{{ isEdit ? '保存' : '创建' }}</el-button>
          <el-button @click=\"\.back()\">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createTemplate, updateTemplate, getTemplateDetail } from '../api/template'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const formRef = ref(null)
const submitting = ref(false)
const picUrl = ref('')

const form = ref({
  name: '',
  msgType: 1,
  content: '',
  title: '',
  description: '',
  mediaIds: [],
  fileUrl: '',
  fileName: '',
})

const rules = {
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  msgType: [{ required: true, message: '请选择消息类型', trigger: 'change' }],
  content: [{ required: true, message: '请输入文本内容', trigger: 'blur' }],
}

const addPic = () => {
  if (picUrl.value.trim() && !form.value.mediaIds.includes(picUrl.value.trim())) {
    form.value.mediaIds.push(picUrl.value.trim())
  }
  picUrl.value = ''
}

const removePic = (idx) => {
  form.value.mediaIds.splice(idx, 1)
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    if (isEdit.value) {
      await updateTemplate(route.params.id, form.value)
      ElMessage.success('保存成功')
    } else {
      await createTemplate(form.value)
      ElMessage.success('创建成功')
    }
    router.push('/templates')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) {
    const res = await getTemplateDetail(route.params.id)
    Object.assign(form.value, res.data)
  }
})
</script>
