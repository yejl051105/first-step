<script setup>
import { userList } from "@/mock/table_list"
import { onMounted, reactive, ref } from "vue";

initUserList()
const localUserList = getUserList()
let tableList = ref(localUserList)

const userMessage = reactive({
  username: '',
  email: '',
  role: '',
  status: ''
})

let currentUserIndex = 0
const total = ref(tableList.value.length)

const editDialogVisible = ref(false)
const addDialogVisible = ref(false)

// 查找的信息  
const searchMessage = reactive({
  keyWord: '',
  role: 'All',
  currentPage: 1,
  pageSize: 4
})

onMounted(() => {
  // 进入页面就显示对应的pageSize的数据
  handleSearch(searchMessage)
})

// 存储用户数据到本地
// 使用声明式函数 函数提升 初始化用户数据的时候才可以直接用函数
function initUserList() {
  const localUserList = localStorage.getItem("userList")
  if (!localUserList) {
    localStorage.setItem("userList", JSON.stringify(userList))
  }
}

// 获取本地存储的用户数据
// 使用声明式函数 函数提升 初始化用户数据的时候才可以直接用函数
function getUserList() {
  const userList = JSON.parse(localStorage.getItem("userList"))
  // [] 是为了防止tableList.value.length为空
  return userList || []
}

// 处理输入框回车事件
const handleEnter = () => {
  handleSearch(searchMessage)
}

// 处理下拉菜单某一项被点击事件
const handleCommand = (command) => {
  searchMessage.role = command
  searchMessage.currentPage = 1
  handleSearch(searchMessage)
}

// 处理切换页数
const handleCurrentChange = (currentPage) => {
  searchMessage.currentPage = currentPage
  handleSearch(searchMessage)
}

// 处理搜索事件 刷新用户数据
const handleSearch = (searchMessage) => {
  let newList = getUserList()

  // 如果传入了关键字
  if (searchMessage.keyWord) {
    // 获取关键字
    const keyWord = searchMessage.keyWord.trim().toLowerCase()
    // 字符串匹配完成模糊搜索
    const matchFuzzy = (text, pattern) => {
      let patternIndex = 0
      for (const char of text) {
        if (char === pattern[patternIndex]) {
          patternIndex += 1
        }
        // 遍历完整个字符串 如果可以和关键字的长度匹配就返回true
        if (patternIndex === pattern.length) {
          return true
        }
      }
      // 遍历完整个字符串，还没有找到和关键字等长的字符就返回false
      return false
    }
    // 遍历数组找到对应关键字的数据
    const fileterList = newList.filter(item => {
      const index = item.email.lastIndexOf("@")
      const email = item.email.slice(0, index).toLowerCase()
      const username = item.username.toLowerCase()
      return matchFuzzy(username, keyWord) || matchFuzzy(email, keyWord)
    })
    newList = fileterList
  }
  // 如果传入了角色分类
  if (searchMessage.role !== 'All') {
    // 获取角色分类
    const role = searchMessage.role
    // 遍历userList数组 获得角色为role的新数据数组
    newList = newList.filter((item) => item.role === role)
  }
  total.value = newList.length
  // 最后根据判断后的用户数据显示第几页的分页数据
  const startIndex = (searchMessage.currentPage - 1) * searchMessage.pageSize
  newList = newList.slice(startIndex, startIndex + searchMessage.pageSize)
  tableList.value = newList
}

// 处理重置搜索条件事件
const handleRest = () => {
  const newSearchMessage = {
    keyWord: '',
    role: 'All',
    currentPage: 1,
    pageSize: 4
  }
  Object.assign(searchMessage, newSearchMessage)
  handleSearch(searchMessage)
}

// 处理编辑事件
const handleEdit = (scope, index, row) => {
  // 获取当前编辑的用户索引 便于后续更新用户数据
  currentUserIndex = index
  editDialogVisible.value = true
  // 获取编辑框的用户信息
  const newUserMessage = {
    username: row.username,
    email: row.email,
    role: row.role,
    status: row.status
  }
  // 防止丢失响应式数据
  Object.assign(userMessage, newUserMessage)
}

// 处理新增用户事件
const handleAdd = () => {
  console.log(11)
  addDialogVisible.value = true
}
// 处理删除用户事件
const handleDelte = (scope, index, row) => {

}

// 处理保存事件
const handleSave = () => {
  editDialogVisible.value = false
  // 这里赋值是为了表格数据和编辑数据的一致
  Object.assign(tableList.value[currentUserIndex], userMessage)
  // 这下面的操作是为了数据和本地数据的一致
  const users = JSON.parse(localStorage.getItem("userList"))
  const clickUser = tableList.value[currentUserIndex]
  // 这个editUser是原来存储在本地的数据
  const editUser = users.find(user => user.id === clickUser.id)
  const editUserID = editUser.id
  // 找到编辑用户在外部文件userList的索引 方便待会删除完重新插入到正确的位置上
  const editUserIndex = users.findIndex(user => user.id === clickUser.id) 
  // 获取到当前编辑的用户 可以删除掉用户了
  const newUsers = users.filter(user => user.id !== editUserID)
  // 这个editUser已经成功被编辑为新的用户数据
  Object.assign(editUser, userMessage)
  // console.log(editUser)
  // 在已经删除了被编辑的用户的新用户数组上追加编辑完成后的用户数据到原来的位置
  newUsers.splice(editUserIndex,0,editUser)
  localStorage.setItem("userList",JSON.stringify(newUsers))
}

</script>

<template>
  <div class="container">
    <h2 class="header">User List Page</h2>
    <div class="table-header">
      <!-- 左边 -->
      <div class="keyWord">
        <span class="title">Search:</span>
        <el-input placeholder="keyWord" @keyup.enter="handleEnter" v-model="searchMessage.keyWord"></el-input>
        <el-button @click="handleRest">reset</el-button>
      </div>
      <!-- 中间 -->
      <div class="role">
        <span class="title">Role:</span>
        <el-dropdown split-button trigger="click" @command="handleCommand">
          {{ searchMessage.role }}
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="All">All</el-dropdown-item>
              <el-dropdown-item command="User">User</el-dropdown-item>
              <el-dropdown-item command="Admin">Admin</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- 右边 -->
      <div class="search">
        <el-button @click="handleSearch(searchMessage)">Search</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table :data="tableList" style="width: 100%;" stripe>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="Username" prop="username"></el-table-column>
        <el-table-column label="Email" prop="email"></el-table-column>
        <el-table-column label="Role" prop="role"></el-table-column>
        <el-table-column label="Status" prop="status"></el-table-column>
        <!-- 编辑按钮 -->
        <el-table-column label="Edit">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope, scope.$index, scope.row)">
              Edit
            </el-button>
          </template>
        </el-table-column>
        <!-- 新增用户和删除用户按钮 -->
        <el-table-column label="Oporate">
          <template #default="scope">
            <el-button size="small" @click="handleAdd(scope, scope.$index, scope.row)">Add</el-button>
            <el-button size="small" @click="handleDelte">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页组件 -->
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :page-size="searchMessage.pageSize" :total=total
        @current-change="handleCurrentChange" v-model:current-page="searchMessage.currentPage" />
      <div class="records">Total:{{ total }} records</div>
    </div>
    <!-- 表单编辑框 -->
    <el-dialog v-model="editDialogVisible" title="Edit User" width="500" align-center>
      <el-form class="form-container" label-position="top" :model="userMessage">
        <el-form-item label="Username" prop="username">
          <el-input v-model="userMessage.username" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="userMessage.email"></el-input>
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="userMessage.role" placeholder="Select" style="width: 240px">
            <el-option value="User">User</el-option>
            <el-option value="Admin">Admin</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-radio-group v-model="userMessage.status">
            <el-radio value="Active">Active</el-radio>
            <el-radio value="Inactive">Inactive</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSave">
            Save
          </el-button>
          <el-button @click="editDialogVisible = false">Cancel</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 新增用户编辑框 -->
    <!-- <el-dialog v-model="addDialogVisible" title="Add User" width="500" align-center>
      <el-form class="form-container" label-position="top">
        <el-form-item label="Username" prop="">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="Role">
          <el-select v-model="value" placeholder="Select" style="width: 240px">
            <el-option>Role</el-option>
            <el-option>User</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Status">
          <el-radio-group>
            <el-radio :value="1">Active</el-radio>
            <el-radio :value="0">Inactive</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="addDialogVisible = false">
            Save
          </el-button>
          <el-button @click="addDialogVisible = false">Cancel</el-button>
        </div>
      </template>
    </el-dialog> -->
  </div>
</template>

<style scoped>
.container {
  padding: 15px;
}

.header {
  padding-bottom: 10px;
  border-bottom: 1px solid red;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.title {
  margin-right: 5px;
}

.keyWord {
  display: flex;
  align-items: center;
}

.role {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search {
  display: flex;
  align-items: center;
}

.table {
  margin-top: 20px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: right;
  padding: 20px;
  margin-top: 35px;
  border-top: 1px solid gray;
}

.records {
  margin-left: 10px;
}

.form-container {
  border-top: 1px solid;
  border-bottom: 1px solid;
  padding: 20px;
}
</style>
