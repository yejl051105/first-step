<script setup>
import { onMounted, reactive, ref } from 'vue';
import { getUserList, setUserList } from '@/api/handleUserList';
import { getEchart } from '@/api/getEchart';

let userlist = getUserList()
let length =  userlist.length

onMounted(() => {
  getEchart()
})

</script>

<template>
  <div class="container">
    <h2 class="header">Dashboard</h2>
    <div class="data">
      <div class="total-users item">
        <div class="number">
          <div class="title">Total Users</div>
          <h1 class="digit">{{length}}</h1>
        </div>
        <div class="icon">
          <el-avatar size="large">
            <i-ep-user id="icon"></i-ep-user>
          </el-avatar>
        </div>
      </div>
      <div class="active-users item">
        <div class="number">
          <div class="title">Active Today</div>
          <h1 class="digit">1248</h1>
        </div>
        <div class="icon">
          <el-avatar size="large">
            <i-ep-user id="icon"></i-ep-user>
          </el-avatar>
        </div>
      </div>
      <div class="register-users item">
        <div class="number">
          <div class="title">New Registrations</div>
          <h1 class="digit">48</h1>
        </div>
        <div class="icon">
          <el-avatar size="large">
            <i-ep-user id="icon"></i-ep-user>
          </el-avatar>
        </div>
      </div>
      <div class="admin-accounts item">
        <div class="number">
          <div class="title">Admin Accounts</div>
          <h1 class="digit">50</h1>
        </div>
        <div class="icon">
          <el-avatar size="large">
            <i-ep-user id="icon"></i-ep-user>
          </el-avatar>
        </div>
      </div>
    </div>
    <div id="visualize-data"> </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 15px;
}

.header {
  padding-bottom: 10px;
  border-bottom: 1px solid red;
}

.data {
  margin: 30px 0;
  display: grid;
  height: 50%;
  /* 两种写法都是一样的效果 */
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr 1fr;
  gap: 20px;
}

.data>div {
  background-color: blue;
}

.item {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#icon {
  width: 100%;
  height: 100%;
}

#visualize-data {
  background-color: pink;
  flex: 1;
}
</style>
