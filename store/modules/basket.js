import axios from "axios";

let state = {
  basket: {
    count: 0,
    blocks: []
  }
};

let getters = {
  basket: state => {
    return state.basket;
  }
};

let mutations = {
  SET_BASKET: (state, payload) => {
    state.basket = payload;
  }
};

let actions = {
  DOWNLOAD_BASKET: async (context, payload) => {
    let basket = {
      blocks: [],
      count: "?"
    };

    axios
      .get(this.$store.state.host + "/basket/get-content")
      .then((response)=>{
        basket.blocks = response.data;
        let count = 0;
        response.data.forEach((block)=>{
          block['units'].forEach((item)=>{
            if (item.type === 'unit'){count += 1;}
          });
        });
        basket.count = count;
      })
      .catch(()=>{console.warn('error while download basket')});

    context.commit('SET_BASKET', basket);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
