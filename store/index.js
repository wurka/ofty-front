import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = () => new Vuex.Store({
  state: {
    counter: 0,
    host:'http://localhost:9000',

    csrf: undefined,  //csrf middleware token for backend csrf security
    // for orders
    orders: [],

    // info about user
    user: {
      username: "anonymous",
      anonymous: true,
      stock:0,
      stockMax:0,
    },
    captcha: {
      enable: true,  // использовать ли капчу
      front: '6LfvotIUAAAAAOuFrracBIL3ZCHNX1sy_UEqaxOj',
      secret: '6LfvotIUAAAAAJsyumxSe0qTaFyIJA-jcS2gP7T9'
    }

  },
  mutations: {
    increment (state) {
      state.counter++
    }
  }
});

export default store
