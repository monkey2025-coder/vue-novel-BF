<template>
  <div class="life-cycle">
    <h2>Vue 3 生命周期完整演示</h2>
    <p>当前计数：{{ count }}</p>
    <button @click="addCount">点击更新数据</button>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue'

console.log('🔴 1. setup 执行（替代 beforeCreate + created）')

const count = ref(0)
const addCount = () => { count.value++ }

onBeforeMount(() => { console.log('🟠 2. onBeforeMount') })
onMounted(() => { console.log('🟢 3. onMounted') })
onBeforeUpdate(() => { console.log('🔵 4. onBeforeUpdate') })
onUpdated(() => { console.log('🟣 5. onUpdated') })
onBeforeUnmount(() => { console.log('🟡 6. onBeforeUnmount') })
onUnmounted(() => { console.log('⚫ 7. onUnmounted') })
</script>