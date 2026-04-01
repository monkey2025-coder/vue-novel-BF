<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <Mycomponents />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Mycomponents from './components/Mycomponents.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Mycomponents
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
