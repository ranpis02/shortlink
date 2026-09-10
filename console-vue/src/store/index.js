import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      domain: import.meta.env.VITE_SHORT_LINK_DOMAIN || window.location.host
    }
  }
})

export default store
