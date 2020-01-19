import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    counter: 0,
    host:'http://ofty.ru',
    username: '',
    anonymous: true,
    stock:0,
    stockMax:0,

  },
  mutations: {
    increment (state) {
      state.counter++
    }
  }
})

export default store
