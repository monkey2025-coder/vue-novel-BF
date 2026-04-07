<template>
  <div class="outline-details">
    <el-button type="primary" @click="goBack">返回</el-button>
    <h1>Outline Details</h1>
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
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      outline: null,
      activeSections: [],
      activeSubsections: {},
      showJson: false
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

.outline-card,
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
</style>