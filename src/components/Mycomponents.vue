<template>
  <div class="hello">
    <h1>{{ title }}</h1>
    <button @click="sendClickHandler">点击传递</button>
  </div>
</template>

<script>
import { h } from 'vue';

export default {
  name: 'Mycomponents',
  props: {

  },
  data() {
    return {
      message: 'Mycomponents',
    }
  },
  methods: {
    sendClickHandler() {
      this.$emit('onEvent', this.message);
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
