import axios from 'axios'
import {host} from '../index'

const state = {
  unit: {
    id: '?'
  },
  colors: {
    'group1': [],
    'group2': [],
    'group3': [],
    'group4': [],
    'group5': [],
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
  },
  COLORS_SELECT_BY_IDS(state, payload) {
    for (let i=1; i<=5; i++) {
      let group = state.colors['group'+i];
      group.forEach((color)=>{
        color.checked = payload.includes(color.id);
      })
    }
  },
  COLORS_SET(state, payload) {
    // присваимвание свойства checked для каждого цвета
    [
      payload.group1,
      payload.group2,
      payload.group3,
      payload.group4,
      payload.group5,
    ].forEach(
      (group)=>{
      group.forEach((color)=>{
        color.checked = false;
      })
    });

    state.colors = payload;
  }
};
const actions = {
  COLORS_INVERSE_CHECKED(context, color) {
    for (let i=1; i<=5; i++) {
      let grp = 'group' + i;
      context.state.colors[grp].forEach((clr)=>{
        if (clr.id === color.id) {
          clr.checked = !clr.checked;
        }
      })
    }
  },
  COLORS_GET(context) {
    axios
      .get(host + "/units/color-picker-source")
      .then((response)=>{
        context.commit('COLORS_SET', response.data)
      })
      .catch((response)=>{
        console.warn('error while getting colors');
        console.log(response);
      });
  },
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
