<template>
  <div class="outline-details">
    <div class="header">
      <div class="header-left">
        <el-button type="primary" @click="goBack">返回</el-button>
        <el-button type="primary" @click="goToDetail()">查看章节内容</el-button>
        <el-button type="warning" @click="openEditDialog">修改大纲</el-button>
      </div>
      <TaskStatusWidget />
    </div>
    <el-card v-if="outline" class="outline-card">
      <template #header>
        <div class="card-header">
          <span>{{ outline.title }}</span>
        </div>
      </template>
      <div class="card-body">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="ID">{{ outline.id }}</el-descriptions-item>
          <el-descriptions-item label="Query">{{ outline.query }}</el-descriptions-item>
          <el-descriptions-item label="Created At">{{ outline.created_at }}</el-descriptions-item>
          <el-descriptions-item label="Updated At">{{ outline.updated_at }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    
    <el-card v-if="outline" class="generate-chapters-card">
      <template #header>
        <span>生成章节</span>
      </template>
      <div class="card-body">
        <el-form ref="chapterForm" :model="chapterFormData" label-width="120px">
          <el-form-item label="章节提示" prop="query">
            <el-input
              v-model="chapterFormData.query"
              type="textarea"
              :rows="3"
              placeholder="请输入章节生成的提示信息..."
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="generateChapters" :loading="generating">
              生成章节
            </el-button>
          </el-form-item>
        </el-form>
        
        <div v-if="chapterResponseMessage" class="response-message" :class="chapterResponseStatus">
          <p>{{ chapterResponseMessage }}</p>
          <p v-if="chapterTaskId">任务ID: {{ chapterTaskId }}</p>
        </div>
      </div>
    </el-card>
    
    <el-card v-if="outline" class="outline-json-card">
      <template #header>
        <div class="card-header">
          <span>Outline JSON</span>
          <el-button type="primary" size="small" @click="toggleJsonView">{{ showJson ? '隐藏 JSON' : '显示 JSON' }}</el-button>
        </div>
      </template>
      <div class="card-body">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="Title">{{ outline.outline_json.title }}</el-descriptions-item>
          <el-descriptions-item label="Description">{{ outline.outline_json.description }}</el-descriptions-item>
          <el-descriptions-item label="Created At">{{ outline.outline_json.created_at }}</el-descriptions-item>
          <el-descriptions-item label="Word Count Estimate">{{ outline.outline_json.word_count_estimate }}</el-descriptions-item>
          <el-descriptions-item label="Keywords">
            <el-tag v-for="(keyword, index) in outline.outline_json.keywords" :key="index" size="small" style="margin-right: 8px;">{{ keyword }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
        
        <div v-if="showJson" class="json-view">
          <h3 style="margin-top: 20px;">JSON 数据</h3>
          <pre>{{ jsonData }}</pre>
        </div>
        
        <h3 style="margin-top: 20px;">Sections</h3>
        <el-collapse v-model="activeSections">
          <el-collapse-item v-for="(section, index) in outline.outline_json.sections" :key="section.id" :title="section.title" :name="index">
            <div class="section-content">
              <p><strong>Description:</strong> {{ section.description }}</p>
              <p><strong>Content:</strong> {{ section.content }}</p>
              <el-collapse v-model="activeSubsections[index]" v-if="section.subsections && section.subsections.length > 0">
                <el-collapse-item v-for="(subsection, subIndex) in section.subsections" :key="subsection.id" :title="subsection.title" :name="subIndex">
                  <p>{{ subsection.content }}</p>
                </el-collapse-item>
              </el-collapse>
              <el-empty v-else description="No subsections" />
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
    
    <el-empty v-else description="Loading..." />
    
    <!-- 修改大纲对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="修改大纲"
      width="600px"
    >
      <el-form ref="editForm" :model="editFormData" label-width="120px">
        <el-form-item label="大纲标题">
          <el-input v-model="editFormData.title" placeholder="请输入大纲标题" />
        </el-form-item>
        
        <el-form-item label="操作类型">
          <el-select v-model="editFormData.operationType" placeholder="请选择操作类型">
            <el-option label="添加章节" value="add_section" />
            <el-option label="删除章节" value="delete_section" />
            <el-option label="修改章节" value="modify_section" />
            <el-option label="移动章节" value="move_section" />
            <el-option label="更新标题" value="update_title" />
          </el-select>
        </el-form-item>
        
        <template v-if="editFormData.operationType === 'add_section'">
          <el-form-item label="章节ID">
            <el-input v-model="editFormData.section.id" placeholder="请输入章节ID" />
          </el-form-item>
          <el-form-item label="章节标题">
            <el-input v-model="editFormData.section.title" placeholder="请输入章节标题" />
          </el-form-item>
          <el-form-item label="章节内容">
            <el-input
              v-model="editFormData.section.content"
              type="textarea"
              :rows="3"
              placeholder="请输入章节内容"
            />
          </el-form-item>
          <el-form-item label="在哪个章节后添加（可选）">
            <el-input v-model="editFormData.afterSectionId" placeholder="section-id" />
          </el-form-item>
        </template>
        
        <template v-if="editFormData.operationType === 'delete_section'">
          <el-form-item label="要删除的章节ID">
            <el-input v-model="editFormData.sectionId" placeholder="请输入要删除的章节ID" />
          </el-form-item>
        </template>
        
        <template v-if="editFormData.operationType === 'modify_section'">
          <el-form-item label="要修改的章节ID">
            <el-input v-model="editFormData.sectionId" placeholder="请输入要修改的章节ID" />
          </el-form-item>
          <el-form-item label="新标题（可选）">
            <el-input v-model="editFormData.section.title" placeholder="请输入新标题" />
          </el-form-item>
          <el-form-item label="新内容（可选）">
            <el-input
              v-model="editFormData.section.content"
              type="textarea"
              :rows="3"
              placeholder="请输入新内容"
            />
          </el-form-item>
        </template>
        
        <template v-if="editFormData.operationType === 'move_section'">
          <el-form-item label="要移动的章节ID">
            <el-input v-model="editFormData.sectionId" placeholder="请输入要移动的章节ID" />
          </el-form-item>
          <el-form-item label="移动到哪个章节后">
            <el-input v-model="editFormData.afterSectionId" placeholder="section-id" />
          </el-form-item>
        </template>
        
        <template v-if="editFormData.operationType === 'update_title'">
          <el-form-item label="新标题">
            <el-input v-model="editFormData.newTitle" placeholder="请输入新的大纲标题" />
          </el-form-item>
        </template>
      </el-form>
      
      <div v-if="editResponseMessage" class="response-message" :class="editResponseStatus" style="margin-bottom: 15px;">
        <p>{{ editResponseMessage }}</p>
      </div>
      
      <template #footer>
        <el-button @click="closeEditDialog">取消</el-button>
        <el-button type="primary" @click="submitEdit" :loading="editing">提交修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import TaskStatusWidget from '@/components/TaskStatusWidget.vue'

export default {
    components: {
        TaskStatusWidget
    },
  data() {
    return {
      outline: null,
      activeSections: [],
      activeSubsections: {},
      showJson: false,
      chapterId: this.$route.params.id,
      chapterFormData: {
        query: ''
      },
      generating: false,
      chapterResponseMessage: '',
      chapterResponseStatus: '',
      chapterTaskId: '',
      // 修改大纲相关
      editDialogVisible: false,
      editing: false,
      editResponseMessage: '',
      editResponseStatus: '',
      editFormData: {
        title: '',
        operationType: '',
        sectionId: '',
        afterSectionId: '',
        newTitle: '',
        section: {
          id: '',
          title: '',
          content: ''
        }
      }
    }
  },
  mounted() {
    this.fetchOutline()
  },
  computed: {
    jsonData() {
      if (this.outline) {
        return JSON.stringify(this.outline, null, 2)
      }
      return ''
    }
  },
  methods: {
    fetchOutline() {
      const id = this.$route.params.id
      axios.get(`/api/outlines/${id}`)
        .then(res => {
          this.outline = res.data.outline
          // 初始化 activeSubsections
          if (this.outline && this.outline.outline_json && this.outline.outline_json.sections) {
            this.outline.outline_json.sections.forEach((section, index) => {
              this.$set(this.activeSubsections, index, [])
            })
          }
        })
        .catch(error => {
          console.error('Error:', error)
        })
    },
    goBack() {
      this.$router.push('/')
    },
    toggleJsonView() {
      this.showJson = !this.showJson
    },
    goToDetail() {
      this.$router.push(`/chapters/${this.chapterId}`)
    },
    generateChapters() {
      this.generating = true
      this.chapterResponseMessage = ''
      this.chapterResponseStatus = ''
      this.chapterTaskId = ''
      
      axios.post('/api/outline/generate_chapters', {
        outline_id: this.$route.params.id,
        query: this.chapterFormData.query || '请根据大纲生成详细章节'
      })
      .then(res => {
        this.chapterResponseMessage = res.data.msg
        this.chapterResponseStatus = 'success'
        this.chapterTaskId = res.data.task_id
        this.chapterFormData.query = ''
      })
      .catch(error => {
        this.chapterResponseMessage = error.response ? error.response.data.detail : '生成章节失败，请重试'
        this.chapterResponseStatus = 'error'
      })
      .finally(() => {
        this.generating = false
      })
    },
    openEditDialog() {
      this.editDialogVisible = true
      if (this.outline) {
        this.editFormData.title = this.outline.title
      }
    },
    closeEditDialog() {
      this.editDialogVisible = false
      this.editResponseMessage = ''
      this.editResponseStatus = ''
      // 重置表单数据
      this.editFormData = {
        title: '',
        operationType: '',
        sectionId: '',
        afterSectionId: '',
        newTitle: '',
        section: {
          id: '',
          title: '',
          content: ''
        }
      }
    },
    submitEdit() {
      if (!this.editFormData.operationType) {
        this.$message.error('请选择操作类型')
        return
      }
      
      const operations = []
      const operation = {
        type: this.editFormData.operationType
      }
      
      switch (this.editFormData.operationType) {
        case 'add_section':
          if (!this.editFormData.section.id || !this.editFormData.section.title) {
            this.$message.error('请填写章节ID和标题')
            return
          }
          operation.section = {
            id: this.editFormData.section.id,
            title: this.editFormData.section.title,
            content: this.editFormData.section.content || ''
          }
          if (this.editFormData.afterSectionId) {
            operation.after_section_id = this.editFormData.afterSectionId
          }
          break
        case 'delete_section':
          if (!this.editFormData.sectionId) {
            this.$message.error('请填写要删除的章节ID')
            return
          }
          operation.section_id = this.editFormData.sectionId
          break
        case 'modify_section':
          if (!this.editFormData.sectionId) {
            this.$message.error('请填写要修改的章节ID')
            return
          }
          operation.section_id = this.editFormData.sectionId
          operation.section = {}
          if (this.editFormData.section.title) {
            operation.section.title = this.editFormData.section.title
          }
          if (this.editFormData.section.content) {
            operation.section.content = this.editFormData.section.content
          }
          break
        case 'move_section':
          if (!this.editFormData.sectionId || !this.editFormData.afterSectionId) {
            this.$message.error('请填写要移动的章节ID和目标位置')
            return
          }
          operation.section_id = this.editFormData.sectionId
          operation.after_section_id = this.editFormData.afterSectionId
          break
        case 'update_title':
          if (!this.editFormData.newTitle) {
            this.$message.error('请填写新标题')
            return
          }
          operation.title = this.editFormData.newTitle
          break
      }
      
      operations.push(operation)
      
      this.editing = true
      this.editResponseMessage = ''
      this.editResponseStatus = ''
      
      axios.post('/api/outlines/update', {
        outline_id: this.$route.params.id,
        operations: operations
      })
      .then(res => {
        this.editResponseMessage = res.data.msg
        this.editResponseStatus = 'success'
        this.outline = res.data.outline
        this.fetchOutline()
      })
      .catch(error => {
        this.editResponseMessage = error.response ? error.response.data.detail : '修改失败，请重试'
        this.editResponseStatus = 'error'
      })
      .finally(() => {
        this.editing = false
      })
    }
  }
}
</script>

<style>
.outline-details {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  gap: 10px;
}

.outline-card,
.generate-chapters-card,
.outline-json-card {
  margin-top: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.card-body {
  margin-top: 20px;
}

.section-content {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  text-align: left;
}

.json-view {
  margin-top: 20px;
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow-x: auto;
  text-align: left;
}

.json-view pre {
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
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