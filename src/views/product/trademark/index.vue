<template>
  <el-card>
    <el-button
      type="primary"
      icon="Plus"
      @click="addTradeMark"
      v-has="'btn.Trademark.add'"
    >
      添加品牌
    </el-button>
    <el-table
      :data="list"
      border
      height="700"
      style="margin: 10px 0"
      v-loading="tableLoading"
    >
      <el-table-column
        label="序号"
        align="center"
        width="80"
        prop="id"
      ></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO" prop="logoUrl">
        <template #="{ row }">
          <el-image
            style="width: 100px; height: 100px"
            :src="row.logoUrl"
            fit="cover"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #="{ row }">
          <el-button
            type="warning"
            icon="Edit"
            @click="editTradeMark(row)"
            v-has="'btn.Trademark.update'"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            icon="Delete"
            @click="delTradeMark(row.id)"
            v-has="'btn.Trademark.remove'"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      background
      layout="prev, pager, next, jumper,->,total, sizes"
      :total="total"
      @size-change="sizeChange"
      @current-change="getFetchList"
    />
  </el-card>

  <el-dialog
    v-model="dialogVisible"
    :title="formData.id ? '修改品牌' : '添加品牌'"
  >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="品牌名称" prop="tmName">
        <el-input v-model="formData.tmName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" prop="logoUrl">
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="formData.logoUrl" :src="formData.logoUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelHandle(formRef)">取消</el-button>
      <el-button type="primary" @click="submitHandle(formRef)">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { UploadProps, FormInstance, FormRules } from 'element-plus'
import { ref, onMounted, reactive } from 'vue'
import {
  fetchList,
  addTradeMarkAPI,
  removeTradeMarkAPI,
  updateTradeMarkAPI,
} from '@/api/product/trademark'
import type { Records, TradMark } from '@/api/product/trademark/type'
let pageNo = ref<number>(1)
let limit = ref<number>(3)
let list = ref<Records>([])
let total = ref<number>(0)
let tableLoading = ref<boolean>(false)
let dialogVisible = ref<boolean>(false)
let title = ref<string>('')
let formData = reactive<TradMark>({
  tmName: '',
  logoUrl: '',
})
const formRef = ref<FormInstance>()
const rules = reactive<FormRules<TradMark>>({
  tmName: [{ required: true, message: '品牌名称', trigger: 'blur' }],
  logoUrl: [{ required: true, message: '上传图片' }],
})

const getFetchList = async (pager = 1) => {
  tableLoading.value = true
  pageNo.value = pager
  const { data } = await fetchList(pageNo.value, limit.value)
  list.value = data.records
  total.value = data.total
  tableLoading.value = false
}
const sizeChange = () => {
  getFetchList()
}
const addTradeMark = () => {
  title.value = '添加品牌'
  dialogVisible.value = true
}
const editTradeMark = (row: TradMark) => {
  title.value = '编辑品牌'
  dialogVisible.value = true
  const { id, tmName, logoUrl } = row
  formData.id = id
  formData.logoUrl = logoUrl
  formData.tmName = tmName
}
const delTradeMark = async (id: number) => {
  try {
    const { message } = await removeTradeMarkAPI(id)
    ElMessage({
      message,
      type: 'success',
    })
    getFetchList(pageNo.value)
  } catch (error) {
    ElMessage({
      message: error as string,
      type: 'error',
    })
  }
}
const cancelHandle = (formEl: FormInstance | undefined) => {
  dialogVisible.value = false
  if (!formEl) return
  formEl.resetFields()
  formData.id = 0
  formData.logoUrl = ''
  formData.tmName = ''
}
const submitHandle = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate()
  let api, params
  const { id, tmName, logoUrl } = formData
  if (id) {
    api = updateTradeMarkAPI
    params = { id, tmName, logoUrl }
  } else {
    api = addTradeMarkAPI
    params = { tmName, logoUrl }
  }
  const { message } = await api(params)
  cancelHandle(formEl)
  ElMessage({
    message,
    type: 'success',
  })
  getFetchList(id ? pageNo.value : 1)
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // png|jpg|gif 4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpg' ||
    rawFile.type == 'image/gif'
  ) {
    const size = rawFile.size / 1024 / 1024 > 4
    if (!size) return true
    ElMessage({
      message: '上传的文件不能大于4M',
      type: 'error',
    })
    return false
  } else {
    ElMessage({
      message: '上传的文件格式只能是png|jpg|gif',
      type: 'error',
    })
    return false
  }
}
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  formData.logoUrl = response.data
  formRef.value?.clearValidate('logoUrl')
}
onMounted(() => {
  getFetchList()
})
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
