<template>
 <div class="home-container">
    <div class="header">
        <h1>大纲列表</h1>
        <div class="header-right">
            <TaskStatusWidget />
            <el-button type="primary" @click="goToCreate">创建大纲</el-button>
        </div>
    </div>
    <div>
        <h2>请求结果</h2>
    </div>
    <el-table
        :data="tableData"
        style="width: 100%"
        element-loading-text="加载中..."
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        v-loading="loading"
    >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="Title" min-width="300" />
        <el-table-column prop="query" label="Query" min-width="200" />
        <el-table-column prop="created_at" label="Created At" width="180" />
        <el-table-column label="Action" width="100">
            <template #default="scope">
                <el-button type="success" icon="Check" circle @click="goToDetail(scope.row.id)" />
                <el-button type="danger"  icon="Delete" circle @click="deleteOutline(scope.row.id)" />
            </template>
        </el-table-column>
    </el-table>
 </div>
</template>
<script>
import {mapState, mapGetters, mapMutations} from 'vuex'
import axios from 'axios'
import { Check, Search, Delete } from '@element-plus/icons-vue'
import TaskStatusWidget from '@/components/TaskStatusWidget.vue'


export default {
    components: {
        TaskStatusWidget
    },
    data() {
        return {
            result: '',
            tableData: [],
            loading: false
        }
    },
    mounted() {
        this.sendRequest()
    },

    computed: {
        
    },
    methods: {
        // 专门发送请求
        sendRequest() {
            this.loading = true
            axios.get('/api/outlines')
                .then(res => {
                    this.tableData = res.data.outlines
                    console.log('Table Data length:', this.tableData.length)
                })
                .catch(error => {
                    console.error('Error:', error)
                })
                .finally(() => {
                    this.loading = false
                })
        },
        goToDetail(id) {
            this.$router.push(`/outline/${id}`)
        },
        goToCreate() {
            this.$router.push('/create-outline')
        },
        deleteOutline(id) {
            axios.post('/api/outlines/delete', {
                outline_id: id
            })
            .then(res => {
                this.$message.success(res.data.msg)
                this.sendRequest()
            })
            .catch(error => {
                    console.error('Error:', error)
            })
        }
    }
}
</script>

<style>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.el-table {
  margin-top: 20px;
}

.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

.el-table th {
  font-weight: bold;
}

.el-table td {
  white-space: normal;
  word-break: break-word;
}
</style>