<template> 
    <div>
        <h1>Home</h1>
        <p>当前计数: {{ $store.state.count }}</p>
        <p>当前计数: {{ count }}</p>
    </div>
</template>


<script>
import {mapState} from 'vuex'

export default {

    // 专门读取store中的数据
    computed: mapState(['count'])
}
</script>