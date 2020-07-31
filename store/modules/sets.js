import axios from "axios";
import {host} from "../index"

let state = {
  sets: []
};

let mutations = {
  SET_SETS: (state, payload) => {
    state.sets = payload;
  }
}

let actions = {
  GET_MY_SETS: (context)=>{
    axios
      .get(host + '/units/my-sets')
      .then((response)=>{
        let mySets = response.data;
        context.commit('SET_SETS', mySets);
      })
      .catch((response)=>{console.error(response)});
  }
}

export default {
  state,
  mutations,
  actions,
}
