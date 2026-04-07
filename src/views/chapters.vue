<template>
  <div class="chapters-container">
    <el-page-header @back="goBack">
      <template #title>
        <span class="page-title">章节列表</span>
      </template>
    </el-page-header>

    <el-card class="chapters-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>章节列表</span>
          <el-button type="primary" size="small" @click="refreshChapters">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>

      <el-table :data="chapters" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="chapter_id" label="章节ID" width="120" />
        <el-table-column prop="title" label="章节标题" />
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="viewChapter(row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button type="success" size="small" @click="editChapter(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="chapters.length === 0" class="empty-state">
        <el-empty description="暂无章节" />
      </div>

      <div class="pagination-container" v-if="chapters.length > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 章节详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
    >
      <el-card v-if="currentChapter" shadow="hover">
        <template #header>
          <div class="chapter-dialog-header">
            <span>{{ currentChapter.title }}</span>
            <el-tag size="small" type="info">{{ currentChapter.chapter_id }}</el-tag>
          </div>
        </template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="内容">
            <div v-if="currentChapter.content" class="chapter-content">
              <div class="content-length">字符长度: {{ contentLength }}</div>
              {{ currentChapter.content }}
            </div>
            <el-empty v-else description="暂无内容" />
          </el-descriptions-item>
          <el-descriptions-item label="摘要">
            <div v-if="currentChapter.summary" class="chapter-summary">
              {{ currentChapter.summary }}
            </div>
            <el-empty v-else description="暂无摘要" />
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-empty v-else description="加载中..." />
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      chapters: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      outlineId: this.$route.params.id,
      dialogVisible: false,
      dialogTitle: '章节详情',
      currentChapter: null
    }
  },
  mounted() {
    this.fetchChapters()
  },
  computed: {
    contentLength() {
      if (this.currentChapter && this.currentChapter.content) {
        return this.currentChapter.content.length
      }
      return 0
    }
  },
  methods: {
    fetchChapters() {
      const id = this.$route.params.id
      axios.get(`/api/outlines/${id}/chapters`)
        .then(res => {
          this.chapters = res.data.chapters
          this.total = res.data.total
        })
        .catch(error => {
          console.error('Error:', error)
          this.$message.error('获取章节列表失败')
        })
    },
    refreshChapters() {
      this.fetchChapters()
      this.$message.success('章节列表已刷新')
    },
    goBack() {
      this.$router.push('/')
    },
    viewChapter(row) {
      this.currentChapter = row
      this.dialogTitle = `章节详情 - ${row.title}`
      this.dialogVisible = true
    },
    editChapter(row) {
      this.$message.info(`编辑章节：${row.title}`)
      // 这里可以添加编辑章节的逻辑
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.fetchChapters()
    },
    handleCurrentChange(current) {
      this.currentPage = current
      this.fetchChapters()
    }
  }
}
</script>

<style>
.chapters-container {
  max-width: 1200px;
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

.chapters-card {
  margin-top: 20px;
}

.empty-state {
  margin: 40px 0;
  text-align: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 章节详情对话框样式 */
.chapter-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.chapter-content,
.chapter-summary {
  white-space: pre-wrap;
  line-height: 1.6;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  min-height: 100px;
}

.content-length {
  font-size: 12px;
  color: #909399;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ebeef5;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chapters-container {
    padding: 10px;
  }

  .chapter-dialog-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>