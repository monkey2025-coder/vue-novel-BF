<template>
  <div class="task-status-widget">
    <el-badge :value="processingCount" class="task-badge" :hidden="processingCount === 0">
      <el-button 
        type="text" 
        @click="goToTaskManager"
        class="task-button"
      >
        <el-icon><ClipboardList /></el-icon>
        <span class="task-count">{{ processingCount }} 个任务进行中</span>
      </el-button>
    </el-badge>
    
    <el-dropdown trigger="click" @command="handleTaskClick">
      <el-button type="text" class="task-button">
        <el-icon><MoreVertical /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu v-if="processingTasks.length > 0">
          <el-dropdown-item 
            v-for="task in processingTasks" 
            :key="task.id"
            :command="task.id"
          >
            <span class="dropdown-task-id">{{ task.id }}</span>
            <el-progress 
              :percentage="task.progress" 
              :size="16"
              class="dropdown-progress"
            />
          </el-dropdown-item>
        </el-dropdown-menu>
        <el-dropdown-menu v-else>
          <el-dropdown-item disabled>暂无进行中的任务</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
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
  computed: {
    processingCount() {
      return this.tasks.filter(task => task.status === 'processing').length
    },
    processingTasks() {
      return this.tasks.filter(task => task.status === 'processing').slice(0, 5)
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
          this.tasks = Object.keys(taskData).map(taskId => ({
            id: taskId,
            ...taskData[taskId]
          }))
        })
        .catch(error => {
          console.error('获取任务状态失败:', error)
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
    goToTaskManager() {
      this.$router.push('/tasks')
    },
    handleTaskClick(taskId) {
      this.$router.push('/tasks')
    }
  }
}
</script>

<style scoped>
.task-status-widget {
  display: flex;
  align-items: center;
  gap: 10px;
}

.task-button {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #606266;
}

.task-button:hover {
  color: #409eff;
}

.task-count {
  font-size: 14px;
}

.task-badge {
  --el-badge-bg-color: #f56c6c;
}

.dropdown-task-id {
  display: inline-block;
  width: 80px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-progress {
  display: inline-block;
  width: 100px;
  vertical-align: middle;
}
</style>