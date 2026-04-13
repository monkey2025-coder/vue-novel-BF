<template>
  <div class="create-outline-container">
    <el-button type="primary" @click="goBack">返回首页</el-button>
    <h1>创建大纲</h1>
    
    <el-card class="create-outline-card">
      <template #header>
        <span>提交问题</span>
      </template>
      <div class="card-body">
        <el-form ref="form" :model="formData" label-width="120px">
          <el-form-item label="问题描述" prop="query">
            <el-input
              v-model="formData.query"
              type="textarea"
              :rows="4"
              placeholder="请输入你想要创建大纲的问题..."
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="loading">
              创建大纲
            </el-button>
          </el-form-item>
        </el-form>
        
        <div v-if="responseMessage" class="response-message" :class="responseStatus">
          <p>{{ responseMessage }}</p>
          <p v-if="taskId">任务ID: {{ taskId }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      formData: {
        query: ''
      },
      loading: false,
      responseMessage: '',
      responseStatus: '',
      taskId: ''
    }
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    submitForm() {
      if (!this.formData.query.trim()) {
        this.$message.error('请输入问题描述')
        return
      }
      
      this.loading = true
      this.responseMessage = ''
      this.responseStatus = ''
      this.taskId = ''
      
      axios.post('/api/outline/create', {
        query: this.formData.query
      })
      .then(res => {
        this.responseMessage = res.data.msg
        this.responseStatus = 'success'
        this.taskId = res.data.task_id
        this.formData.query = ''
      })
      .catch(error => {
        this.responseMessage = error.response ? error.response.data.detail : '创建失败，请重试'
        this.responseStatus = 'error'
      })
      .finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style>
.create-outline-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.create-outline-card {
  margin-top: 20px;
}

.card-body {
  margin-top: 20px;
}

.response-message {
  margin-top: 20px;
  padding: 15px;
  border-radius: 4px;
}

.response-message.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.response-message.error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}
</style>