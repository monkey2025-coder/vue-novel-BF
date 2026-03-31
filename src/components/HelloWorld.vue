<template>
  <div class="hello">
    <p>{{ msg }}</p>
    <div v-html="rawHtml"></div>
    <div v-bind:id="dynamicId" :class="dynamicClass">This div has a dynamic id</div>
    <p>{{ num  + 10}}</p>
    <p>{{ flag ? 'Flag is true' : 'Flag is false' }}</p>
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
      msg: 'Hello World',
      rawHtml: '<span style="color: red">This is raw HTML</span>',
      dynamicId: 'my-id',
      dynamicClass: 'my-class',
      num: 10,
      flag: true,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
