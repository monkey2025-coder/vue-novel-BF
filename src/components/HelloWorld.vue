<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>当前计数: {{ count.count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script>
import { h, ref, reactive } from 'vue';



export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup(props, ctx) {
    console.log(props.msg)
    console.log(ctx)


    const msg = ref(props.msg) // 简单变量使用ref
    const count = reactive({ // 复杂变量使用reactive
        count: 0
    })
    
    // 增加计数
    function increment() {
        count.count++
    }
    
    return {
      msg,
      count,
      increment
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
