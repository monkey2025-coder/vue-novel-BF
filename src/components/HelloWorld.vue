<template>
  <div class="hello">
    <p>{{ msg }}</p>
    <button v-on:click="counter += 1">点击 {{ counter }}</button>
    <button @click="counter += 1">点击 {{ counter }}</button>
    <button @click="counterHandler">点击 {{ counter }}</button>
    <button @click="Say(counter)">点击 {{ counter }}</button>
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
      counter: 0,
      msg: 'Hello World'
    }
  },
  methods: {
    counterHandler() {
      this.counter += 1;
      this.msg = "good good study, day day up"
    },
    Say(data) {
      alert(data);
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
