<template>
  <router-link to="/">Home</router-link>
  <router-view></router-view>
</template>

<script>
import { h, ref, reactive } from 'vue';



export default {
  name: 'Index',
  props: {
    msg: String
  },
  setup(props, ctx) {
    console.log(props.msg)
    console.log(ctx)


    return {
    
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
