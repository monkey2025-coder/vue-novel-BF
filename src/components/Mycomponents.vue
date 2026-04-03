<template>
  <div>
    <div>{{ data }}</div>
    <button @click="addUser">点击提交数据</button>
    <button @click="getData">点击获取数据</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      data: ''
    }
  },

  methods: {
    async getData() {
      try {
        const res = await axios.get('https://jsonplaceholder.typicode.com/users')
        this.data = res.data
      } catch (err) {
        console.error('请求失败', err)
      }
    },
    async addUser() {
      this.loading = true
      this.error = ''

      try {
        const params = {name: 'Vue3 用户',email: 'test@test.com'}

        const res = await axios.post(
          'https://jsonplaceholder.typicode.com/users',
          params
        )

        console.log('POST 请求成功：', res.data)
        alert('添加成功！返回ID：' + res.data.id)
      } catch (err) {
        this.error = '添加失败：' + err.message
        console.error('POST 请求错误：', err)
      } finally {
        this.loading = false
      }
    }
  },

  // 生命周期：组件挂载完立即执行
  mounted() {
    this.getData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
