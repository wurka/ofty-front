import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = () => new Vuex.Store({
  state: {
    counter: 0,
    host:'http://localhost:9000',
    username: '',
    anonymous: true,
    stock:0,
    stockMax:0,
    csrf: undefined,  //csrf middleware token for backend csrf security
    // for orders
    orders: [],

    // info about user
    user: {
      username: "anonymous",
      isAnonymous: true
    },

  },
  mutations: {
    increment (state) {
      state.counter++
    }
  }
});

export default store
