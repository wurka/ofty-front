import Vue from 'vue'
import Vuex from 'vuex'
import orders from './modules/orders'
import basket from './modules/basket'
import csrf from './modules/csrf'

Vue.use(Vuex);

export function host() {
  return 'http://localhost:9000'
}

const store = () => new Vuex.Store({
  state: {
    host:'http://localhost:9000',

    //csrf: undefined,  //csrf middleware token for backend csrf security
    // info about user
    user: {
      username: "anonymous",
      anonymous: true,
      stock:0,
      stockMax:0,
    },
    captcha: {
      enable: false,  // использовать ли капчу
      front: '6LfvotIUAAAAAOuFrracBIL3ZCHNX1sy_UEqaxOj',
    },
    companies: [
    ],  // список компаний
  },
  mutations: {
    increment (state) {
      state.counter++
    }
  },
  modules: {
    orders,
    basket,
    csrf
  }
});

export default store
