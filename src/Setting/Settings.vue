<script setup>
import { ref } from 'vue'

const value = ref('User')
const options = [
  {
    value: 'Admin',
    label: 'Admin',
  },
  {
    value: 'User',
    label: 'User',
  }
]

</script>

<template>
  <div class="container">
    <h2 class="header">Basic Settings</h2>
    <div class="information">
      <el-form label-position="top">
        <el-form-item label="Username:" class="item">
          <el-input style="width: 360px"> </el-input>
        </el-form-item>
        <el-form-item label="Email:" class="item">
          <el-input style="width: 360px"> </el-input>
        </el-form-item>
        <el-form-item label="Role:" class="item">
          <el-select v-model="value" placeholder="Select" style="width: 360px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
              :disabled="true" />
          </el-select>
        </el-form-item>
        <el-form-item label="Bio:" class="item">
          <el-input type="textarea" style="width: 360px"></el-input>
        </el-form-item>
      </el-form>
      <div class="bottom">
        <el-button>Save</el-button>
        <el-button>Cancel</el-button>
      </div>
    </div>
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
  padding: 15px;
}

.header {
  padding-bottom: 10px;
  border-bottom: 1px solid red;
}


.information {
  margin: 30px;
  padding: 20px;
  flex: 1;
  /* background-color: blue; */
  border: 1px solid black;
}

.item {
  margin: 20px;
}
</style>