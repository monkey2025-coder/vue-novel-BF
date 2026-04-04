<template> 
    <div>
        <h1>Home</h1>
        <p>当前计数: {{ $store.state.count }}</p>
        <p>当前计数: {{ count }}</p>
        <p>当前计数: {{ $store.getters.getCount }}</p>
        <p>当前计数: {{ getCount }}</p>
        <button @click="increment">增加</button>
        <button @click="increment2">自定义增加</button>
        <button @click="increment3">自定义增加2</button>
        <button @click="increment4">异步增加</button>
    </div>
</template>


<script>
import {mapState, mapGetters, mapMutations} from 'vuex'

export default {

    // 专门读取store中的数据
    computed: {
        ...mapState(['count']),
        ...mapGetters(['getCount'])
    },
    methods: {
        ...mapMutations(['increment', 'increment_num']),
        // 自定义方法
        increment2() {
            this.$store.commit('increment')
        },
        // 自定义方法2
        increment3() {
            // this.$store.commit('increment_num', 2)
            this.increment_num(2)
        },
        // 自定义方法3
        increment4() {
            this.$store.dispatch('asyncincrement_num')
        }

        
    }
}
</script>