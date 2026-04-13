# 增量修改 API 调用文档

## 概述

本文档描述了大纲和章节的增量修改 API 的使用方法。这些接口允许通过操作指令列表对大纲或章节进行灵活的增量修改。

---

## 一、大纲增量修改接口

### 1.1 接口信息

| 属性 | 值 |
|------|-----|
| **URL** | `/api/outlines/update` |
| **方法** | `POST` |
| **Content-Type** | `application/json` |

### 1.2 请求参数

请求体结构：

```json
{
  "outline_id": 1,
  "operations": [
    {
      "type": "操作类型",
      // 其他参数根据操作类型而定
    }
  ]
}
```

### 1.3 支持的操作类型

#### 1.3.1 添加章节 (`add_section`)

```json
{
  "type": "add_section",
  "after_section_id": "section-1",  // 可选，在哪个章节之后添加
  "section": {
    "id": "section-1-1",
    "title": "新章节标题",
    "content": "章节内容概要"
  }
}
```

#### 1.3.2 删除章节 (`delete_section`)

```json
{
  "type": "delete_section",
  "section_id": "section-2"
}
```

#### 1.3.3 修改章节 (`modify_section`)

```json
{
  "type": "modify_section",
  "section_id": "section-1",
  "section": {
    "title": "修改后的标题",   // 可选
    "content": "修改后的内容"  // 可选
  }
}
```

#### 1.3.4 移动章节 (`move_section`)

```json
{
  "type": "move_section",
  "section_id": "section-3",
  "after_section_id": "section-1"  // 移动到哪个章节之后
}
```

#### 1.3.5 更新标题 (`update_title`)

```json
{
  "type": "update_title",
  "title": "新的大纲标题"
}
```

### 1.4 请求示例

```bash
curl -X POST "http://localhost:8000/api/outlines/update" \
  -H "Content-Type: application/json" \
  -d '{
    "outline_id": 1,
    "operations": [
      {
        "type": "add_section",
        "after_section_id": "section-1",
        "section": {
          "id": "section-1-1",
          "title": "新增子章节",
          "content": "这是新增的子章节内容"
        }
      },
      {
        "type": "modify_section",
        "section_id": "section-2",
        "section": {
          "title": "修改后的第二章标题"
        }
      },
      {
        "type": "update_title",
        "title": "更新后的大纲标题"
      }
    ]
  }'
```

### 1.5 响应示例

**成功响应**：
```json
{
  "status": "success",
  "msg": "大纲修改成功，共应用 3 个操作",
  "outline_id": 1,
  "changes_applied": 3,
  "errors": [],
  "outline": {
    "id": 1,
    "title": "更新后的大纲标题",
    "query": "原始查询词",
    "outline_json": {
      "title": "更新后的大纲标题",
      "sections": [...]
    },
    "created_at": "2024-01-01 10:00:00",
    "updated_at": "2024-01-01 12:00:00"
  }
}
```

**部分失败响应**：
```json
{
  "status": "success",
  "msg": "大纲修改成功，共应用 2 个操作",
  "outline_id": 1,
  "changes_applied": 2,
  "errors": [
    {
      "operation_index": 1,
      "operation_type": "delete_section",
      "error": "未找到章节"
    }
  ],
  "outline": { ... }
}
```

---

## 二、章节增量修改接口

### 2.1 接口信息

| 属性 | 值 |
|------|-----|
| **URL** | `/api/chapters/update` |
| **方法** | `POST` |
| **Content-Type** | `application/json` |

### 2.2 请求参数

请求体结构：

```json
{
  "chapter_id": 1,
  "operations": [
    {
      "type": "操作类型",
      // 其他参数根据操作类型而定
    }
  ]
}
```

### 2.3 支持的操作类型

#### 2.3.1 替换文本 (`replace`)

```json
{
  "type": "replace",
  "old_text": "要替换的原文内容",
  "new_text": "替换后的新内容"
}
```

#### 2.3.2 插入文本 (`insert`)

```json
{
  "type": "insert",
  "after_text": "在这句话之后插入",
  "insert_text": "要插入的新内容"
}
```

#### 2.3.3 删除文本 (`delete`)

```json
{
  "type": "delete",
  "text": "要删除的内容"
}
```

#### 2.3.4 追加文本 (`append`)

```json
{
  "type": "append",
  "text": "追加到章节末尾的内容"
}
```

#### 2.3.5 前置文本 (`prepend`)

```json
{
  "type": "prepend",
  "text": "添加到章节开头的内容"
}
```

#### 2.3.6 更新标题 (`update_title`)

```json
{
  "type": "update_title",
  "title": "新的章节标题"
}
```

### 2.4 请求示例

```bash
curl -X POST "http://localhost:8000/api/chapters/update" \
  -H "Content-Type: application/json" \
  -d '{
    "chapter_id": 1,
    "operations": [
      {
        "type": "replace",
        "old_text": "旧的描述内容",
        "new_text": "新的描述内容"
      },
      {
        "type": "insert",
        "after_text": "故事发生在一个小镇上。",
        "insert_text": "这个小镇名叫清风镇，风景秀丽，民风淳朴。"
      },
      {
        "type": "update_title",
        "title": "第一章：清风镇的秘密"
      },
      {
        "type": "append",
        "text": "\n\n本章完。"
      }
    ]
  }'
```

### 2.5 响应示例

**成功响应**：
```json
{
  "status": "success",
  "msg": "章节修改成功，共应用 4 个操作",
  "chapter_id": 1,
  "changes_applied": 4,
  "errors": [],
  "chapter": {
    "id": 1,
    "outline_id": 1,
    "chapter_id": "section-1",
    "title": "第一章：清风镇的秘密",
    "content": "修改后的完整内容...",
    "summary": "章节摘要...",
    "created_at": "2024-01-01 10:00:00",
    "updated_at": "2024-01-01 12:00:00"
  }
}
```

---

## 三、前端调用示例

### 3.1 使用 JavaScript/Fetch

```javascript
// 修改大纲
async function updateOutline(outlineId, operations) {
  const response = await fetch('/api/outlines/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      outline_id: outlineId,
      operations: operations
    })
  });
  
  return await response.json();
}

// 修改章节
async function updateChapter(chapterId, operations) {
  const response = await fetch('/api/chapters/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chapter_id: chapterId,
      operations: operations
    })
  });
  
  return await response.json();
}

// 使用示例
const outlineOperations = [
  {
    type: 'add_section',
    section: {
      id: 'new-section',
      title: '新增章节',
      content: '章节内容'
    }
  }
];

updateOutline(1, outlineOperations)
  .then(result => {
    console.log('修改结果:', result);
    if (result.status === 'success') {
      console.log('成功应用', result.changes_applied, '个操作');
      // 更新 UI
    } else {
      console.error('修改失败:', result.errors);
    }
  });
```

### 3.2 使用 Axios

```javascript
import axios from 'axios';

// 修改大纲
async function updateOutline(outlineId, operations) {
  try {
    const response = await axios.post('/api/outlines/update', {
      outline_id: outlineId,
      operations: operations
    });
    return response.data;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}

// 修改章节
async function updateChapter(chapterId, operations) {
  try {
    const response = await axios.post('/api/chapters/update', {
      chapter_id: chapterId,
      operations: operations
    });
    return response.data;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}
```

---

## 四、错误处理指南

### 4.1 常见错误类型

| HTTP 状态码 | 错误描述 | 原因 |
|------------|---------|------|
| 400 | 操作指令不能为空 | 请求体中 `operations` 为空或不是数组 |
| 404 | 大纲/章节不存在 | 指定的 `outline_id` 或 `chapter_id` 不存在 |
| 500 | 服务器内部错误 | 数据库操作失败或其他服务器错误 |

### 4.2 操作级别的错误

即使返回状态为 `success`，也可能存在部分操作失败的情况。需要检查 `errors` 数组：

```javascript
const result = await updateOutline(1, operations);

if (result.status === 'success') {
  if (result.errors.length > 0) {
    console.warn('部分操作失败:', result.errors);
    result.errors.forEach(error => {
      console.log(`操作 ${error.operation_index} (${error.operation_type}): ${error.error}`);
    });
  }
}
```

---

## 五、最佳实践

### 5.1 批量操作

建议将多个相关操作合并到一次请求中，减少网络请求次数：

```json
{
  "chapter_id": 1,
  "operations": [
    { "type": "update_title", "title": "新标题" },
    { "type": "replace", "old_text": "旧文本", "new_text": "新文本" },
    { "type": "append", "text": "结尾内容" }
  ]
}
```

### 5.2 操作顺序

操作按照数组顺序依次执行，后续操作基于前序操作的结果：

```json
{
  "chapter_id": 1,
  "operations": [
    // 先插入文本
    { "type": "insert", "after_text": "A", "insert_text": "B" },
    // 然后可以操作新插入的文本
    { "type": "replace", "old_text": "B", "new_text": "C" }
  ]
}
```

### 5.3 错误恢复

对于失败的操作，可以记录下来并在合适时机重试：

```javascript
const result = await updateOutline(outlineId, operations);

// 收集失败的操作
const failedOps = result.errors.map(error => ({
  operation: operations[error.operation_index],
  error: error.error
}));

// 可以稍后重试这些失败的操作
if (failedOps.length > 0) {
  // 保存到本地存储或发送到服务器日志
  saveFailedOperations(failedOps);
}
```
