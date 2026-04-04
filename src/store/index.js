import { createStore } from 'vuex'
import axios from 'axios'

// 直接导出，甚至都不用写了
export default createStore({
    state: {
        count: 0
    },
    getters: {
        getCount(state) {
            return state.count > 0 ? state.count : "count is negative"
        }
    },
    mutations: {
        increment(state) {
            state.count++
        },
        increment_num(state, num) {
            state.count += num
        }
    },
    actions: {
        asyncincrement_num({commit}) {
            axios.get('/api').then(res => {
                commit('increment_num', res.status)
            })
        }
    }

})