<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input placeholder="请你输入" v-model="keyword"></el-input>
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
    <el-button type="primary" size="default" icon="Plus" @click="addRole">
      添加职位
    </el-button>
    <el-table border style="margin: 10px 0" :data="list">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="职位名称"
        align="center"
        show-overflow-tooltip
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        show-overflow-tooltip
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <template #="{ row }">
          <el-button size="small" icon="User" @click="setPermission(row)">
            分配权限
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateRole(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.roleName}?`"
            width="260px"
            @confirm="removeRole(row.id)"
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
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper , ->, sizes, total, "
      :total="total"
      @current-change="getFetchList"
      @size-change="sizeHandler"
    />
  </el-card>
  <el-dialog
    v-model="dialogVisible"
    :title="roleParams.id ? '更新职位' : '添加职位'"
  >
    <el-form
      ref="roleRef"
      :model="roleParams"
      label-width="80px"
      :rules="rules"
    >
      <el-form-item label="职位名称" prop="roleName">
        <el-input v-model="roleParams.roleName" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="roleCancel">取消</el-button>
      <el-button @click="submitRole">确定</el-button>
    </template>
  </el-dialog>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="treeCancel">取消</el-button>
        <el-button type="primary" @click="treeSubmit">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref, onMounted, reactive } from 'vue'
import {
  fetchList,
  addOrUpdateRole,
  addPermission,
  reqSetPermission,
  reqRemoveRole,
} from '@/api/acl/role'
import type { Records, Role, MenuList } from '@/api/acl/role/type'
import type { FormInstance, FormRules } from 'element-plus'
const roleRef = ref<FormInstance>()
const keyword = ref<string>('')
const pageNo = ref<number>(1)
const pageSize = ref<number>(10)
const total = ref<number>(0)
const list = ref<Records>([])
const dialogVisible = ref<boolean>(false)
const drawer = ref<boolean>(false)
const tree = ref<any>()
let roleParams = reactive<Role>({
  roleName: '',
})
const menuArr = ref<MenuList>([])
let selectArr = ref<number[]>([])
const defaultProps = {
  children: 'children',
  label: 'name',
}
const rules = reactive<FormRules<Role>>({
  roleName: [{ required: true, message: '角色姓名', trigger: 'blur' }],
})
const getFetchList = async (pager: number = 1) => {
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
  pageSize.value = 10
  getFetchList()
}
const setPermission = async (row: Role) => {
  Object.assign(roleParams, row)
  const { data } = await addPermission(row.id as number)
  menuArr.value = data
  drawer.value = true
  treeFilters(menuArr.value)
}
const updateRole = async (row: Role) => {
  dialogVisible.value = true
  Object.assign(roleParams, row)
}
const removeRole = async (id: number) => {
  const { message } = await reqRemoveRole(id)
  ElMessage({
    message,
    type: 'success',
  })
  getFetchList(list.value.length > 1 ? pageNo.value : pageNo.value - 1)
}
const sizeHandler = () => {}
const addRole = () => {
  dialogVisible.value = true
}
const roleCancel = () => {
  dialogVisible.value = false
  roleRef.value?.resetFields()
  roleParams.id = 0
}
const submitRole = async () => {
  await roleRef.value?.validate()
  const { id, roleName } = roleParams
  const { message } = await addOrUpdateRole({ id, roleName })
  ElMessage({
    message,
    type: 'success',
  })
  roleCancel()
  getFetchList(id ? pageNo.value : 1)
}
const treeCancel = () => {
  drawer.value = false
  selectArr.value = []
}
const treeSubmit = async () => {
  let arr = tree.value.getCheckedKeys()
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)
  const { message } = await reqSetPermission(
    roleParams.id as number,
    permissionId,
  )
  ElMessage({
    message,
    type: 'success',
  })
  drawer.value = false
  getFetchList(pageNo.value)
  // 如果是修改自己的权限的话需要重新刷新下
  // window.location.reload()
}
const treeFilters = (allData: any) => {
  allData.forEach((item: any) => {
    if (item.children && item.children.length > 0) {
      treeFilters(item.children)
    } else if (item.select) {
      selectArr.value.push(item.id)
    }
  })
}
onMounted(() => {
  getFetchList()
})
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
