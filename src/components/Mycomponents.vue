<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import { h } from 'vue';

export default {
  name: 'Mycomponents',
  props: {
    msg: String
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
