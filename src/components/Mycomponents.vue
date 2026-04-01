<template>
  <div class="hello">
    <h1>props 传递数据 {{ title }}</h1>
    <ul>
      <li v-for="value in people" :key="value">{{ value }}</li>
    </ul>
  </div>
</template>

<script>
import { h } from 'vue';

export default {
  name: 'Mycomponents',
  props: {
    title: {
      type: String,
      default: 'Mycomponents'
    },
    people: {
      type: Array,
      default: function(){
        return []
      }
    }
  },
  data() {
    return {
      msg: 'Mycomponents',
    }
  },
  methods: {
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
