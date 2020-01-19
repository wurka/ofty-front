<template>
  <div class="layout" :class="{hidden: notLoaded, visible: !notLoaded}">
    <SiteHeader/>
    <div class="my-body">
      <div class="link-panel">
        <ul>
          <li>Настройки профиля</li>
          <li>Календарь</li>
          <li>Мои заказы</li>
          <li>Запросы от клиентов</li>
          <li>Мой декор</li>
          <li>Оплата</li>
          <li>Мои коллекции</li>
        </ul>
      </div>
      <div class="content-panel">
        <div>
          <label>
            counter
            <input type="text" :value="$store.state.counter">
          </label>
        </div>
        <input type="button" value="+" @click="increment">
        <div class="order" v-for="order in $store.state.orders" :key="order.id">
          one order
        </div>
      </div>
    </div>
    <div class="shield" v-if="loginOpened"></div>
  </div>
</template>

<script>
  import {Module as $store} from "vuex"
  import axios from 'axios'
  import SiteHeader from "../../components/shared/SiteHeader";

  export default {
    name: "orders",
    components: {SiteHeader},
    data: ()=>({
      notLoaded: true,
      csrf: null,
      loginOpened: false
    }),
    methods: {
      increment() {
        this.$store.commit('increment')
      },
      openLoginDialog() {
        this.loginOpened = true;
      },
      closeLoginDialog() {
        this.loginOpened = false;
      },
      logout() {
        let vm = this;
        axios
          .post(this.$store.state.host + '/account/logout', {},
            {
              headers: {
                "X-CSRFToken": vm.$store.state.csrf
              }
            })
          .then(this.aboutMe)
          .catch((resp)=>{
            if (resp.response) {
              console.warn("не получилось выйти: " + resp.response.data);
            }
          });
      },
      aboutMe() {
        axios
          .get(this.$store.state.host + "/shared/get-csrf-token")
          .then((ans) => {this.$store.state.csrf = ans.data;});
        //this.csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        axios
          .get(this.$store.state.host + "/account/about-me")
          .then((ans) => {
            console.log(ans.data);
            this.$store.state.user.username = ans.data['username'];
            this.$store.state.user.isAnonymous = ans.data['anonymous'];
          });
      },
      loginSuccess() {
        this.closeLoginDialog();
        this.aboutMe();
      },
      getMyOrders() {
        axios
          .get(this.$store.state.host + "/orders/get-my-orders", {params: {
              page: 1
            }})
          .then((data)=>{console.log(data)})
          .catch((resp)=>{
            if (resp.response) {
              console.warn(resp.response.data);
            }
          })
      }
    },
    computed: {
      counter: function () {
        return this.$store.state.counter;
      }
    },
    mounted() {
      this.notLoaded = false;
      this.aboutMe();
      this.getMyOrders();
    }
  }
</script>

<style lang="sass">
  @import url('http://127.0.0.1:9000/static/fonts/stylesheet.css')
  .hidden
    opacity: 0
  .visible
    opacity: 1
    transition: 0.3s
  $pageBackground: #f5f5f5
  html
    background: #f5f5f5
    font-family: Philosopher, serif
  .header
    height: 130px
    background: pink
  .layout
    width: 1140px
    margin: auto
    background: white
  .my-body
    display: flex
  .link-panel
    width: 224px
    background: $pageBackground
    margin: 13px
    ul
      list-style-type: none
      li
        width: 190px
        height: 39px
        margin: 9px 0 9px 0
  .content-panel
    flex-grow: 1
    border: 1px solid #000
  .shield
    background: #F5F5F5
    opacity: 0.8
    position: absolute
    width: 100vw
    height: 100vh
    top: 0
    left: 0
  .fade-enter-active, .fade-leave-active
    transition: opacity .5s
  .fade-enter, .fade-leave-to
    opacity: 0
</style>
