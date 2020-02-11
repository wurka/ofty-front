import axios from "axios";

let state = {
  csrf: ''
};

let getters = {};
let mutations = {
  CSRF_SET(state, payload){
    state.csrf = payload;
  }
};
let actions = {
  CSRF_GET(context){
    axios
      .get(this.$store.state.host + "/csrf")
      .then((response)=>{
        let new_csrf = response.data;
        context.commit(new_csrf)
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
