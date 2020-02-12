<template>
  <div class="layout" :class="{hidden: notLoaded, visible: !notLoaded}">
    <SiteHeader/>
    <div class="my-body">
      <div class="link-panel">
        <OfficeMenu/>
      </div>
      <div class="content-panel">
        <div class="order" v-for="order in source" :key="order.id">
          <div class="flex">
            <div class="status-time">
              <div class="status">Статус сделки - {{order.statusText}}</div>
              <div class="time">{{order.start}} - {{order.stop}}</div>
            </div>
            <div class="owner-info" v-if="mode==='order'">
              <div class="name">{{order['owner'].name}}</div>
              <div class="phone" v-if="order['owner']['phone'] !== ''">{{order['owner']['phone']}}</div>
              <div class="phone" v-if="order['owner']['phone2'] !== ''">{{order['owner']['phone2']}}</div>
            </div>
            <div class="owner-info" v-if="mode==='deal'">
              <div class="name">{{order['client'].name}}</div>
              <div class="phone" v-if="order['client']['phone'] !== ''">{{order['client']['phone']}}</div>
              <div class="phone" v-if="order['client']['phone2'] !== ''">{{order['client']['phone2']}}</div>
            </div>
          </div>
          <div class="pictures">
            <div class="picture" v-for="(picture, index) in order['pictures']" v-bind:key="'picture-'+index">
              <img v-bind:src="picture" alt="picture" width="88" height="88">
            </div>
          </div>
          <div class="commentary">
            Комментарий: {{order['commentary']}}
          </div>
          <div class="cost">
            <div class="pay">Оплата: {{order['cost']}}</div>
            <div class="pay">Залог: {{order['bail']}}</div>
          </div>
          {{order}}
          <div class="buttons">
            <div class="button" v-if="order['status'] === 'init'">Изменить</div>
            <div class="button" @click="reject()">Отказаться</div>
            <div class="button">Сообщение</div>
          </div>
        </div>
      </div>
    </div>
    <div class="shield" v-if="loginOpened"></div>
  </div>
</template>

<script>
  import {Module as $store} from "vuex"
  import axios from 'axios'
  import SiteHeader from "~/components/shared/SiteHeader";
  import OfficeMenu from "~/components/shared/OfficeMenu";

  export default {
    name: "OrderDeal",
    components: {OfficeMenu, SiteHeader},
    data: ()=>({
      notLoaded: true,
      csrf: null,
      loginOpened: false
    }),
    props: {
      mode: String,
    },
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
          .get(this.$store.state.host + "/account/about-me")
          .then((ans) => {
            console.log(ans.data);
            this.$store.state.user.username = ans.data['username'];
            this.$store.state.user.anonymous = ans.data['anonymous'];
          });
      },
      loginSuccess() {
        this.closeLoginDialog();
        this.aboutMe();
      },
    },
    computed: {
      source(){
        if (this.$props.mode == 'order') {
          return this.$store.getters.ORDERS;
        } else {
          return this.$store.getters.DEALS;
        }
      }
    },
    mounted() {
      this.notLoaded = false;
      this.aboutMe();
      this.$store.dispatch('ORDERS_GET');
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
  .order
    margin: 0 0 23px 0
    background: #f6f6f6
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
    padding: 11px 13px
    font-family: Philosopher, serif
    &:nth-child(2n)
      background: white
  .flex
    display: flex
  .status-time
    flex-grow: 1
    .status
      font-size: 18px
    .time
      font-size: 15.5px
  .owner-info
    flex-grow: 1
    text-align: right
    .name
      font-size: 18px
    .phone, .phone2
      font-size: 15.5px
  .pictures
    .picture
      display: inline-block
      &:not(:first-child)
        margin: 0 0 0 5px
  .commentary
    font-size: 15.5px
    padding: 7px 0 0 5px
  .cost
    padding: 7px 0 0 5px
    margin: 10px 0 0 0
    .pay
      min-width: 150px
      display: inline-block
    .bail
      display: inline-block
  .buttons
    text-align: right
    margin: 10px 0 10px 0
    .button
      cursor: pointer
      display: inline-block
      font-size: 15.5px
      width: 170px
      background: white
      border: 1px solid #c4c4c4
      box-sizing: border-box
      height: 37px
      line-height: 37px
      vertical-align: middle
      text-align: center
      justify-content: center
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
      user-select: none
      &:hover
        background: #F8F8F8
      &:active
        transform: scale(0.95)
      &:last-child
        margin: 0 16px 0 0
      &:not(:last-child)
        margin: 0 43px 0 0
</style>
