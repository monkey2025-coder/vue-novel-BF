<template>
  <div>
    <div>{{ data }}</div>
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
        const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
        this.data = res.data
      } catch (err) {
        console.error('请求失败', err)
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
