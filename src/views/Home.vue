<template>
 <div class="home-container">
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
            </template>
        </el-table-column>
    </el-table>
 </div>
</template>
<script>
// 现在唯一不解的是这里要放什么呢？
// 在初期的时候 这里只是一个展示的界面
// 先读取出来先~~~
// 默认启动，静默加载，然后再根据id来获取数据

import {mapState, mapGetters, mapMutations} from 'vuex'
import axios from 'axios'
import { Check, Search } from '@element-plus/icons-vue'


export default {
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

    // 专门读取store中的数据
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
        // 跳转到详情页面
        goToDetail(id) {
            this.$router.push(`/outline/${id}`)
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