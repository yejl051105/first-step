<script setup>
import { userList } from "@/mock/table_list"
import { onMounted, reactive, ref } from "vue";

let tableList = ref(userList)
const total = ref(userList.length)
const centerDialogVisible = ref(false)

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

// 处理下拉菜单某一项被点击事件
const handleCommand = (command) => {
  searchMessage.role = command
}

// 处理编辑事件
const handleEdit = (scope, index, row) => {
  centerDialogVisible.value = true

}

// 处理切换页数
const handleCurrentChange = (currentPage) => {
  searchMessage.currentPage = currentPage
  handleSearch(searchMessage)
}

// 处理搜索事件 刷新用户数据
const handleSearch = (searchMessage) => {
  let newList = userList

  // 如果传入了关键字
  if (searchMessage.keyWord) {
    // 获取关键字
    const keyWord = searchMessage.keyWord.trim().toLowerCase()
    const matchFuzzy = (text, pattern) => {
      let patternIndex = 0

      for (const char of text) {
        if (char === pattern[patternIndex]) {
          patternIndex += 1
        }

        if (patternIndex === pattern.length) {
          return true
        }
      }

      return false
    }
    // 遍历数组找到对应关键字的数据
    const fileterList = newList.filter(item => {
      const email = item.email
      const index = email.lastIndexOf("@")
      const newEamil = email.slice(0, index).toLowerCase()
      const username = item.username.toLowerCase()

      return matchFuzzy(username, keyWord) || matchFuzzy(newEamil, keyWord)
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

</script>

<template>
  <div class="container">
    <h2 class="header">User List Page</h2>
    <div class="table-header">
      <!-- 左边 -->
      <div class="keyWord">
        <span class="title">Search:</span>
        <el-input placeholder="keyWord" v-model="searchMessage.keyWord"></el-input>
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
        <el-table-column label="Actions">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope, scope.$index, scope.row)">
              Edit
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页组件 -->
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :page-size="searchMessage.pageSize" :total=total
        @current-change="handleCurrentChange" />
      <div class="records">Total:{{ total }} records</div>
    </div>
    <!-- 表单编辑框 -->
    <el-dialog v-model="centerDialogVisible" title="Edit User" width="500" align-center>
      <el-form class="form-container">
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
          <el-button type="primary" @click="centerDialogVisible = false">
            Save
          </el-button>
          <el-button @click="centerDialogVisible = false">Cancel</el-button>
        </div>
      </template>
    </el-dialog>

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
