<template>
  <div class="task-manager">
    <el-page-header @back="goBack">
      <template #title>
        <span class="page-title">任务管理</span>
      </template>
    </el-page-header>

    <el-card class="task-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>任务列表</span>
          <el-button type="primary" size="small" @click="refreshTasks">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>

      <div v-if="tasks.length === 0" class="empty-state">
        <el-empty description="暂无任务" />
      </div>

      <el-timeline v-else>
        <el-timeline-item 
          v-for="task in tasks" 
          :key="task.id"
          :timestamp="formatTime(task.updatedAt)"
          :type="getTaskType(task.status)"
        >
          <el-card :shadow="task.status === 'processing' ? 'hover' : 'none'">
            <div class="task-content">
              <div class="task-header">
                <span class="task-id">任务ID: {{ task.id }}</span>
                <el-tag :type="getTagType(task.status)">{{ getStatusText(task.status) }}</el-tag>
              </div>
              
              <div v-if="task.status === 'processing'" class="task-progress">
                <el-progress 
                  :percentage="task.progress" 
                  :status="task.progress === 100 ? 'success' : 'active'"
                />
              </div>
              
              <div v-if="task.result" class="task-result">
                <h4>执行结果</h4>
                <pre>{{ JSON.stringify(task.result, null, 2) }}</pre>
              </div>
              
              <div v-if="task.error" class="task-error">
                <h4>错误信息</h4>
                <p>{{ task.error }}</p>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      tasks: [],
      pollingInterval: null
    }
  },
  mounted() {
    this.fetchTasks()
    this.startPolling()
  },
  beforeUnmount() {
    this.stopPolling()
  },
  methods: {
    fetchTasks() {
      axios.get('/api/task/')
        .then(res => {
          const taskData = res.data.data
          // 将对象转换为数组
          this.tasks = Object.keys(taskData).map(taskId => ({
            id: taskId,
            ...taskData[taskId],
            updatedAt: new Date().toISOString()
          }))
          // 按更新时间排序
          this.tasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        })
        .catch(error => {
          console.error('获取任务列表失败:', error)
        })
    },
    startPolling() {
      this.pollingInterval = setInterval(() => {
        this.fetchTasks()
      }, 5000)
    },
    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
        this.pollingInterval = null
      }
    },
    refreshTasks() {
      this.fetchTasks()
      this.$message.success('任务列表已刷新')
    },
    goBack() {
      this.$router.push('/')
    },
    formatTime(timestamp) {
      if (!timestamp) return '刚刚'
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN')
    },
    getTaskType(status) {
      switch (status) {
        case 'completed':
          return 'success'
        case 'failed':
          return 'danger'
        default:
          return 'primary'
      }
    },
    getTagType(status) {
      switch (status) {
        case 'completed':
          return 'success'
        case 'failed':
          return 'danger'
        default:
          return 'warning'
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'completed':
          return '已完成'
        case 'failed':
          return '失败'
        default:
          return '处理中'
      }
    }
  }
}
</script>

<style>
.task-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.task-card {
  margin-top: 20px;
}

.empty-state {
  margin: 40px 0;
  text-align: center;
}

.task-content {
  padding: 10px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.task-id {
  font-size: 14px;
  color: #606266;
}

.task-progress {
  margin-bottom: 10px;
}

.task-result {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.task-result h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #606266;
}

.task-result pre {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

.task-error {
  margin-top: 10px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
}

.task-error h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #c62828;
}

.task-error p {
  margin: 0;
  font-size: 12px;
  color: #c62828;
  word-break: break-all;
}

.el-timeline-item__timestamp {
  font-size: 12px;
}
</style>