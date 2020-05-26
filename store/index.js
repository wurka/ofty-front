import Vuex from 'vuex'
import Vue from 'vue'
import orders from './modules/orders'
import deals from './modules/deals'
import basket from './modules/basket'
import csrf from './modules/csrf'
import unit from './modules/unit'

Vue.use(Vuex);

const store = () => new Vuex.Store({
  state: {
    host:'http://localhost:9000',

    //csrf: undefined,  //csrf middleware token for backend csrf security
    // info about user
    user: {
      id: 0,
      username: "anonymous",
      anonymous: true,
      stock:0,
      stockMax:0,
      webSocket: undefined,
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
    unit,
    orders,
    deals,
    basket,
    csrf
  }
});

export const host = 'http://localhost:9000';

export default store
