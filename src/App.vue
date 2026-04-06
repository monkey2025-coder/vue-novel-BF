<template>
  <Index msg="Hello Vue 3!" />
</template>

<script>
import Index from './components/Index.vue'

export default {
  name: 'App',
  data() {
    return {
    }
  },
  components: {
    Index
  },
  methods: {

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
