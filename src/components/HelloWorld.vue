<template>
  <div class="hello">
    <p v-if="flag">是吗</p>
    <p v-else>不是吗</p>
    <p v-show="flag">你是谁？</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      flag: true,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
