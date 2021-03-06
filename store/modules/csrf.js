import axios from "axios";
import {host} from "~/store/index"

let state = {
  csrf: 'no csrf'
};

let getters = {};
let mutations = {
  CSRF_SET: (state, payload)=>{
    state.csrf = payload;
  }
};
let actions = {
  CSRF_GET(context){
    axios
      .get(host + "/csrf")
      .then((response)=>{
        let new_csrf = response.data;
        context.commit('CSRF_SET', new_csrf);
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
