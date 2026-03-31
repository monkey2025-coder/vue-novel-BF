<template>
  <div class="hello">
    <input type="text" v-model="msg">
    <p>{{ msg }}</p>
    <input type="text" v-model.lazy="msg2">
    <p>{{ msg2 }}</p>
    <input type="text" v-model.trim="msg3">
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
      msg: '',
      msg2: '',
      msg3: ''
    }
  },
  methods: {
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
