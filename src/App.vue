<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <Mycomponents @onEvent="handleEvent"/>
  <ComponentLifecycle />
  <p>{{ msg }}</p>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Mycomponents from './components/Mycomponents.vue'
import ComponentLifecycle from './components/ComponentLifecycle.vue'

export default {
  name: 'App',
  data() {
    return {
      title: 'App',
      people: ["123","456"],
      msg: ''
    }
  },
  components: {
    HelloWorld,
    Mycomponents,
    ComponentLifecycle
  },
  methods: {
    handleEvent(data) {
      console.log('父组件接收到了事件，携带的数据是：', data);
      this.msg = data;
    }
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
