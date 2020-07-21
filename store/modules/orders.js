import axios from 'axios'
import {host} from '../index'

const state = {
  orders: []
};
const getters = {
  ORDERS: state => {
    return state.orders;
  }
};
const mutations = {
  ORDERS_SET(state, payload) {
    state.orders = payload;
  }
};
const actions = {
  ORDERS_GET(context) {
    axios
      .get(host + "/orders/get-my-orders", {params: {
          page: 1
        }})
      .then((response)=>{
        let new_orders = response.data;
        context.commit('ORDERS_SET', new_orders);
      })
      .catch((resp)=>{
        if (resp.response) {
          console.warn(resp.response.data);
        }
      })
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};
