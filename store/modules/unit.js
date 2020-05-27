import axios from 'axios'
import host from '../index'

const state = {
  unit: {
    id: '?'
  }
};
const getters = {
  UNIT_VIEW: state => {
    return state.unit;
  }
};
const mutations = {
  UNIT_SET(state, payload) {
    state.unit = payload;
  }
};
const actions = {
  UNIT_GET(context, param) {
    console.log(param);
    axios
      .get(host + "/units/unit/" + param)
      .then((response)=>{
        let new_unit = response.data[0];
        context.commit("UNIT_SET", new_unit);
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
