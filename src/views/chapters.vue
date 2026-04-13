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
          <div class="button-group">
            <el-button type="primary" size="small" @click="refreshChapters">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
            <el-button type="warning" size="small" @click="reviseChapters">
              <el-icon><Refresh /></el-icon>
              精修所有章节
            </el-button>
          </div>
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
            <el-button type="danger" size="small" @click="deleteChapter(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
            <el-button type="primary" size="small" @click="autoReviseChapter(row)">
              <el-icon><Refresh /></el-icon>
              自动ai精修
            </el-button>
            <el-button type="warning" size="small" @click="openChapterEditDialog">
              <el-icon><Edit /></el-icon>
              修改
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
          <el-descriptions-item label="">
            <div v-if="currentChapter.content" class="chapter-content">
              <div class="content-length">字符长度: {{ contentLength }}</div>
              {{ currentChapter.content }}
            </div>
            <el-empty v-else description="暂无内容" />
          </el-descriptions-item>
        </el-descriptions>
    
        <div class="chapter-actions">
          
          <el-button type="success" @click="reviseChapters" :loading="revising">精修章节</el-button>
        </div>
        
        <div v-if="reviseResponseMessage" class="response-message" :class="reviseResponseStatus">
          <p>{{ reviseResponseMessage }}</p>
          <p v-if="reviseTaskId">任务ID: {{ reviseTaskId }}</p>
        </div>
      </el-card>
      <el-empty v-else description="加载中..." />
    </el-dialog>
    
    <!-- 修改章节对话框 -->
    <el-dialog
      v-model="chapterEditDialogVisible"
      title="修改章节"
      width="900px"
    >
      <div class="edit-dialog-content">
        <!-- 左边：原文内容 -->
        <div class="content-panel">
          <h3>原文内容</h3>
          <div 
            class="content-text" 
            @mouseup="handleTextSelection"
            @touchend="handleTextSelection"
          >
            <template v-if="currentChapter && currentChapter.content">
              {{ currentChapter.content }}
            </template>
            <template v-else>
              暂无内容
            </template>
          </div>
          <div v-if="selectedText" class="selected-text-info">
            <span>已选中：</span>
            <span class="selected-text">{{ selectedText }}</span>
          </div>
        </div>
        
        <!-- 右边：表单 -->
        <div class="form-panel">
          <el-form ref="chapterEditForm" :model="chapterEditFormData" label-width="120px">
            <el-form-item label="章节标题">
              <el-input v-model="chapterEditFormData.title" placeholder="请输入章节标题" />
            </el-form-item>
            
            <el-form-item label="操作类型">
              <el-select v-model="chapterEditFormData.operationType" placeholder="请选择操作类型">
                <el-option label="替换文本" value="replace" />
                <el-option label="插入文本" value="insert" />
                <el-option label="删除文本" value="delete" />
                <el-option label="追加文本" value="append" />
                <el-option label="前置文本" value="prepend" />
                <el-option label="更新标题" value="update_title" />
              </el-select>
            </el-form-item>
            
            <template v-if="chapterEditFormData.operationType === 'replace'">
              <el-form-item label="要替换的原文">
                <el-input
                  v-model="chapterEditFormData.oldText"
                  type="textarea"
                  :rows="2"
                  placeholder="拖拽左侧文本自动填充"
                />
              </el-form-item>
              <el-form-item label="替换后的新内容">
                <el-input
                  v-model="chapterEditFormData.newText"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入替换后的新内容"
                />
              </el-form-item>
            </template>
            
            <template v-if="chapterEditFormData.operationType === 'insert'">
              <el-form-item label="在这句话之后插入">
                <el-input
                  v-model="chapterEditFormData.afterText"
                  type="textarea"
                  :rows="2"
                  placeholder="拖拽左侧文本自动填充"
                />
              </el-form-item>
              <el-form-item label="要插入的内容">
                <el-input
                  v-model="chapterEditFormData.insertText"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入要插入的新内容"
                />
              </el-form-item>
            </template>
            
            <template v-if="chapterEditFormData.operationType === 'delete'">
              <el-form-item label="要删除的内容">
                <el-input
                  v-model="chapterEditFormData.deleteText"
                  type="textarea"
                  :rows="2"
                  placeholder="拖拽左侧文本自动填充"
                />
              </el-form-item>
            </template>
            
            <template v-if="chapterEditFormData.operationType === 'append'">
              <el-form-item label="追加到末尾的内容">
                <el-input
                  v-model="chapterEditFormData.appendText"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入要追加到章节末尾的内容"
                />
              </el-form-item>
            </template>
            
            <template v-if="chapterEditFormData.operationType === 'prepend'">
              <el-form-item label="添加到开头的内容">
                <el-input
                  v-model="chapterEditFormData.prependText"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入要添加到章节开头的内容"
                />
              </el-form-item>
            </template>
            
            <template v-if="chapterEditFormData.operationType === 'update_title'">
              <el-form-item label="新标题">
                <el-input v-model="chapterEditFormData.newTitle" placeholder="请输入新的章节标题" />
              </el-form-item>
            </template>
          </el-form>
        </div>
      </div>
      
      <div v-if="chapterEditResponseMessage" class="response-message" :class="chapterEditResponseStatus" style="margin-bottom: 15px;">
        <p>{{ chapterEditResponseMessage }}</p>
      </div>
      
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
      currentChapter: null,
      revising: false,
      reviseResponseMessage: '',
      reviseResponseStatus: '',
      reviseTaskId: '',
      // 修改章节相关
      chapterEditDialogVisible: false,
      chapterEditing: false,
      chapterEditResponseMessage: '',
      chapterEditResponseStatus: '',
      chapterEditFormData: {
        title: '',
        operationType: '',
        oldText: '',
        newText: '',
        afterText: '',
        insertText: '',
        deleteText: '',
        appendText: '',
        prependText: '',
        newTitle: ''
      },
      selectedText: ''
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
    deleteChapter(row) {
      this.$message.info(`删除章节${row.title}`)
      axios.post(`/api/chapters/delete`, {
        chapter_id: row.id
      })
        .then(res => {
          this.fetchChapters()
          this.$message.success(res.data.msg)
        })
        .catch(error => {
          console.error('Error:', error)
        })
    },
    autoReviseChapter(row) {
      this.$message.info(`自动ai精修章节${row.title}`)
      axios.post(`/api/chapter/revise`, {
        chapter_id: row.id
      })
        .then(res => {
          this.fetchChapters()
          this.$message.success(res.data.msg)
        })
        .catch(error => {
          console.error('Error:', error)
          this.$message.error('自动ai精修章节失败')
        })
    },
    reviseChapters() {
      this.revising = true
      this.reviseResponseMessage = ''
      this.reviseResponseStatus = ''
      this.reviseTaskId = ''
      
      axios.post('/api/outline/revise_chapters', {
        outline_id: this.$route.params.id
      })
      .then(res => {
        this.reviseResponseMessage = res.data.msg
        this.reviseResponseStatus = 'success'
        this.reviseTaskId = res.data.task_id
      })
      .catch(error => {
        this.reviseResponseMessage = error.response ? error.response.data.detail : '精修章节失败，请重试'
        this.reviseResponseStatus = 'error'
      })
      .finally(() => {
        this.revising = false
      })
    },
    openChapterEditDialog() {
      this.chapterEditDialogVisible = true
      // 初始化表单数据
      if (this.currentChapter) {
        this.chapterEditFormData.title = this.currentChapter.title
      }
      this.selectedText = ''
    },
    handleTextSelection() {
      const selection = window.getSelection()
      const text = selection.toString().trim()
      
      if (text) {
        this.selectedText = text
        
        // 根据当前选择的操作类型，自动填充对应的字段
        switch (this.chapterEditFormData.operationType) {
          case 'replace':
            this.chapterEditFormData.oldText = text
            break
          case 'insert':
            this.chapterEditFormData.afterText = text
            break
          case 'delete':
            this.chapterEditFormData.deleteText = text
            break
        }
      }
    },
    closeChapterEditDialog() {
      this.chapterEditDialogVisible = false
      this.chapterEditResponseMessage = ''
      this.chapterEditResponseStatus = ''
      // 重置表单数据
      this.chapterEditFormData = {
        title: '',
        operationType: '',
        oldText: '',
        newText: '',
        afterText: '',
        insertText: '',
        deleteText: '',
        appendText: '',
        prependText: '',
        newTitle: ''
      }
    },
    submitChapterEdit() {
      if (!this.currentChapter) {
        this.$message.error('请先选择要修改的章节')
        return
      }
      
      if (!this.chapterEditFormData.operationType) {
        this.$message.error('请选择操作类型')
        return
      }
      
      const operations = []
      const operation = {
        type: this.chapterEditFormData.operationType
      }
      
      switch (this.chapterEditFormData.operationType) {
        case 'replace':
          if (!this.chapterEditFormData.oldText || !this.chapterEditFormData.newText) {
            this.$message.error('请填写要替换的原文和新内容')
            return
          }
          operation.old_text = this.chapterEditFormData.oldText
          operation.new_text = this.chapterEditFormData.newText
          break
        case 'insert':
          if (!this.chapterEditFormData.afterText || !this.chapterEditFormData.insertText) {
            this.$message.error('请填写插入位置和要插入的内容')
            return
          }
          operation.after_text = this.chapterEditFormData.afterText
          operation.insert_text = this.chapterEditFormData.insertText
          break
        case 'delete':
          if (!this.chapterEditFormData.deleteText) {
            this.$message.error('请填写要删除的内容')
            return
          }
          operation.text = this.chapterEditFormData.deleteText
          break
        case 'append':
          if (!this.chapterEditFormData.appendText) {
            this.$message.error('请填写要追加的内容')
            return
          }
          operation.text = this.chapterEditFormData.appendText
          break
        case 'prepend':
          if (!this.chapterEditFormData.prependText) {
            this.$message.error('请填写要前置的内容')
            return
          }
          operation.text = this.chapterEditFormData.prependText
          break
        case 'update_title':
          if (!this.chapterEditFormData.newTitle) {
            this.$message.error('请填写新标题')
            return
          }
          operation.title = this.chapterEditFormData.newTitle
          break
      }
      
      operations.push(operation)
      
      this.chapterEditing = true
      this.chapterEditResponseMessage = ''
      this.chapterEditResponseStatus = ''
      
      axios.post('/api/chapters/update', {
        chapter_id: this.currentChapter.id,
        operations: operations
      })
      .then(res => {
        this.chapterEditResponseMessage = res.data.msg
        this.chapterEditResponseStatus = 'success'
        // 更新本地数据
        this.currentChapter = res.data.chapter
        // 刷新章节列表
        this.fetchChapters()
      })
      .catch(error => {
        this.chapterEditResponseMessage = error.response ? error.response.data.detail : '修改失败，请重试'
        this.chapterEditResponseStatus = 'error'
      })
      .finally(() => {
        this.chapterEditing = false
      })
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

.button-group {
  display: flex;
  gap: 10px;
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

.chapter-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.chapter-content {
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

.chapter-actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
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

/* 编辑章节对话框样式 */
.edit-dialog-content {
  display: flex;
  gap: 20px;
  height: 500px;
}

.content-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ebeef5;
  padding-right: 20px;
}

.content-panel h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}

.content-text {
  flex: 1;
  white-space: pre-wrap;
  line-height: 1.6;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  overflow-y: auto;
  cursor: text;
  user-select: text;
}

.selected-text-info {
  margin-top: 15px;
  padding: 10px;
  background-color: #e8f5e9;
  border-radius: 4px;
  font-size: 14px;
}

.selected-text {
  display: block;
  margin-top: 5px;
  padding: 5px;
  background-color: #fff;
  border-radius: 3px;
  word-break: break-all;
}

.form-panel {
  flex: 1;
  overflow-y: auto;
}

.form-panel .el-form {
  margin: 0;
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