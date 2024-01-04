<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="card-form">
      <el-form-item label="用户名:">
        <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="search">
          搜索
        </el-button>
        <el-button size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" size="default" @click="addUser">
      添加用户
    </el-button>
    <el-button type="danger" size="default" @click="deleteSelection">
      批量删除
    </el-button>
    <el-table
      style="margin: 10px 0"
      border
      :data="list"
      height="600"
      @selection-change="tableSelect"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户名称"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row }">
          <el-button size="small" icon="User" @click="setRole(row)">
            分配角色
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="editUser(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定删除${row.username}`"
            width="260px"
            @confirm="deleteUser(row)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9]"
      background
      layout=" prev, pager, next, jumper,->,sizes, total"
      :total="total"
      @size-change="sizeChange"
      @current-change="getFetchList"
    />
  </el-card>
  <el-drawer v-model="addDrawer">
    <template #header>
      <h4>{{ !formData.id ? '添加用户' : '更新用户' }}</h4>
    </template>
    <template #default>
      <el-form
        label-width="80px"
        :model="formData"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="用户姓名" prop="username">
          <el-input placeholder="请输入" v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input placeholder="请输入" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!formData.id">
          <el-input placeholder="请输入" v-model="formData.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="submitHandle">确认</el-button>
      </div>
    </template>
  </el-drawer>
  <el-drawer v-model="roleDrawer">
    <template #header>
      <h4>分配角色用户</h4>
    </template>
    <template #default>
      <el-form :model="roleData">
        <el-form-item label="用户姓名">
          <el-input v-model="roleData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色列表" class="role-list">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="checkedRole"
            @change="handleCheckedUsersChange"
          >
            <el-checkbox v-for="(role, i) in allRoles" :key="i" :label="role">
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="roleCancel">取消</el-button>
        <el-button type="primary" @click="roleSubmit">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  fetchList,
  addOrUpdateUser,
  allRoleList,
  setUserRole,
  removeUser,
  removeUsers,
} from '@/api/acl/user'
import type { Records, User, AllRole } from '@/api/acl/user/type'
import { ref, onMounted, reactive, nextTick } from 'vue'
const keyword = ref<string>('')
const pageNo = ref<number>(1)
const pageSize = ref<number>(5)
const total = ref<number>(0)
const list = ref<Records>([])
const addDrawer = ref<boolean>(false)
const roleDrawer = ref<boolean>(false)
const checkAll = ref<boolean>(false)
const isIndeterminate = ref<boolean>(true)
const checkedRole = ref<AllRole>([])
const allRoles = ref<AllRole>([])
const selectIds = ref<number[]>([])
let formData = reactive<User>({
  username: '',
  name: '',
  password: '',
})
let roleData = reactive<User>({})
const formRef = ref<FormInstance>()
const rules = reactive<FormRules<User>>({
  username: [
    { required: true, message: '用户姓名', trigger: 'blur' },
    { min: 5, max: 15, message: '姓名至少5位', trigger: 'blur' },
  ],
  name: [{ required: true, message: '用户昵称', trigger: 'blur' }],
  password: [
    { required: true, message: '用户密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
})
const getFetchList = async (pager = 1) => {
  pageNo.value = pager
  const { data } = await fetchList(pageNo.value, pageSize.value, keyword.value)
  list.value = data.records
  total.value = data.total
}
const search = () => {
  getFetchList()
}
const reset = () => {
  keyword.value = ''
  pageNo.value = 1
  pageSize.value = 5
  getFetchList()
}
const sizeChange = () => {
  getFetchList()
}
const addUser = () => {
  addDrawer.value = true
}
const editUser = (row: User) => {
  nextTick(() => {
    const { id, username, name, password } = row
    formData.id = id
    formData.username = username
    formData.name = name
    formData.password = password
  })
  addDrawer.value = true
}
const deleteUser = async (row: User) => {
  const { message } = await removeUser(row.id as number)
  getFetchList(list.value.length > 1 ? pageNo.value : pageNo.value - 1)
  ElMessage({
    message,
    type: 'success',
  })
}
const tableSelect = (selection: Records) => {
  selectIds.value = selection.map((select: User) => select.id as number)
}
const deleteSelection = async () => {
  const { message } = await removeUsers(selectIds.value)
  ElMessage({
    message,
    type: 'success',
  })
  getFetchList(list.value.length > 1 ? pageNo.value : pageNo.value - 1)
}
const cancelClick = () => {
  addDrawer.value = false
  formRef.value?.resetFields()
  formData.id = 0
  formData.username = ''
  formData.name = ''
  formData.password = ''
}
const submitHandle = async () => {
  await formRef.value?.validate()
  try {
    let params = {}
    const { id, username, name, password } = formData
    if (id) {
      params = { id, username, name, password }
    } else {
      params = { username, name, password }
    }
    const { message } = await addOrUpdateUser(params)
    ElMessage({
      message,
      type: 'success',
    })
    cancelClick()
    // 因为window.location.reload 会刷新重新渲染 所有getFetchList执行有点多余
    // getFetchList(id ? pageNo.value : 1)
    window.location.reload()
  } catch (error) {
    console.log(error)
    addDrawer.value = false
    ElMessage({
      message: error as string,
      type: 'error',
    })
  }
}
const setRole = async (row: User) => {
  Object.assign(roleData, row)
  const { data } = await allRoleList(row.id as number)
  roleDrawer.value = true
  checkedRole.value = data.assignRoles
  allRoles.value = data.allRolesList
}
const handleCheckAllChange = (val: boolean) => {
  checkedRole.value = val ? allRoles.value : []
  isIndeterminate.value = false
}
const handleCheckedUsersChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRoles.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRoles.value.length
}
const roleCancel = () => {
  roleDrawer.value = false
}
const roleSubmit = async () => {
  const { message } = await setUserRole({
    userId: roleData.id as number,
    roleIdList: checkedRole.value.map((item) => item.id),
  })
  ElMessage({
    message,
    type: 'success',
  })
  // 编辑后 留在当前页
  getFetchList(pageNo.value)
  roleCancel()
}
onMounted(() => {
  getFetchList()
})
</script>

<style lang="scss" scoped>
.card-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.role-list {
  ::v-deep .el-form-item__content {
    display: block !important;
  }
}
</style>
