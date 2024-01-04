<template>
  <el-table
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
    :data="PermissionArr"
  >
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="code" label="权限值" />
    <el-table-column prop="updateTime" label="修改时间" show-overflow-tooltip />
    <el-table-column label="操作" width="260px">
      <template #="{ row }">
        <el-button
          size="small"
          :disabled="row.level === 4 ? true : false"
          @click="addPermission(row)"
        >
          {{ row.level === 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="row.level === 1 ? true : false"
          @click="updatePermission(row)"
        >
          编辑
        </el-button>
        <el-popconfirm
          :title="`你确定要删除${row.name}?`"
          width="260px"
          @confirm="removeMenu(row.id)"
        >
          <template #reference>
            <el-button
              type="danger"
              size="small"
              :disabled="row.level === 1 ? true : false"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    v-model="dialogVisible"
    :title="menuData.id ? '更新菜单' : '添加菜单'"
  >
    <el-form ref="menuRef" :model="menuData">
      <el-form-item label="名称" prop="name">
        <el-input
          placeholder="请你输入菜单的名称"
          v-model="menuData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="code">
        <el-input
          placeholder="请你输入权限数值"
          v-model="menuData.code"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { PermissionList, Permission, MenuParams } from '@/api/acl/menu/type'
import type { FormInstance } from 'element-plus'
import {
  reqAllPermission,
  reqAddOrUpdateMenu,
  reqRemoveMenu,
} from '@/api/acl/menu'
const menuRef = ref<FormInstance>()
const PermissionArr = ref<PermissionList>([])
const dialogVisible = ref<boolean>(false)
const menuData = reactive<MenuParams>({
  code: '',
  name: '',
  pid: 0,
  level: 0,
})
const addPermission = (row: Permission) => {
  dialogVisible.value = true
  menuData.level = row.level + 1
  menuData.pid = row.id as number
}
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  Object.assign(menuData, row)
}
const removeMenu = async (id: number) => {
  const { message } = await reqRemoveMenu(id)
  ElMessage({
    message,
    type: 'success',
  })
  getList()
}
const cancel = () => {
  dialogVisible.value = false
  menuRef.value?.resetFields()
  menuData.id = 0
}
const save = async () => {
  const { message } = await reqAddOrUpdateMenu(menuData)
  ElMessage({
    message,
    type: 'success',
  })
  cancel()
  getList()
}
const getList = async () => {
  const { data } = await reqAllPermission()
  PermissionArr.value = data
}
onMounted(() => {
  getList()
})
</script>
