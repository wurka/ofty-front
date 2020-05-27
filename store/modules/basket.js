import axios from "axios";
import {host} from "../index"
import {blockBailAndCost} from "~/static/myTools";

let state = {
  basket: {
    ready: false,
    count: "?",
    blocks: []
  }
};

let getters = {
  BASKET: state => {
    return state.basket;
  }
};

let mutations = {
  SET_BASKET: (state, payload) => {
    state.basket = payload;
  }
};

let actions = {
  BASKET_DOWNLOAD: (context, payload) => {
    let basket = {
      ready: true,
      blocks: [],
      count: "?"
    };

    let now = new Date(),
      year = now.getFullYear(),
      month = now.getMonth()+1,
      day = now.getDate();

    axios
      .get(host + "/basket/get-content")
      .then((response)=>{
        let count = 0;
        response.data.forEach((block)=>{
          block['units'].forEach((item)=>{
            if (item.type === 'unit'){count += 1;}
            item['order-count'] = 1;
          });

          block['commentary'] = '';
          block['from'] = day.toString()+"."+month+"."+year;
          block['to'] = (day+1).toString()+"."+month+"."+year;
          let bac = blockBailAndCost(block);
          block['bail'] = bac.bail;
          block['cost'] = bac.cost;
          block['ok'] = bac.ok;
        });
        basket.blocks = response.data;
        basket.count = count;
        context.commit('SET_BASKET', basket);
      })
      .catch((response)=>{console.warn(response)});
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
