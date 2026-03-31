<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li v-for="(news, index) in newsList" :key="news.id" :id="news.id">{{ news.title }}</li>
    </ul>
  </div>
</template>

<script>
import { h } from 'vue';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      newsList: [
        { id: 1, title: '新闻1' },
        { id: 2, title: '新闻2' },
        { id: 3, title: '新闻3' }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
