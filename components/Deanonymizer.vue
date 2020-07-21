<template>
  <!-- этот элемент предназначен для вывода пользователю информации о том, что надо зайти на сайт -->
  <div class="deanonymizer-layout" v-show="$store.state.user.anonymous"
       v-cloak>
    <div class="content">
      <div class="title">Эта страница доступна только зарегестрированным пользователям</div>
      <div class="login">
        <LoginBlock :shown="true" ref="LoginBlock"/>
      </div>
      <div class="image">
        <img :src="$store.state.host+'/static/img/shared/whosthere.svg'" alt="whos.svg">
        <div class="buttons">
          <div class="button"
               @click="showLoginForm">Представиться</div>
          <div class="button"
               @click="showRegisterForm">Создать аккаунт</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import LoginBlock from "~/components/shared/LoginBlock";
  export default {
    name: "Deanonymizer",
    components: {LoginBlock},
    mounted() {
    },
    methods: {
      showLoginForm() {
        this.$refs.LoginBlock.guest = false;
        this.$refs.LoginBlock.shown = true;
      },
      showRegisterForm() {
        this.$refs.LoginBlock.guest = true;
        this.$refs.LoginBlock.shown = true;
      }
    }
  }
</script>

<style scoped lang="sass">
  @keyframes delayed
    0%
      opacity: 0
    50%
      opacity: 0
    100%
      opacity: 1
  [v-cloak]
    display: none
  .deanonymizer-layout
    animation: 1s delayed
    animation-fill-mode: forwards
    position: fixed
    top: 0
    left: 0
    background: white
    width: 100vw
    height: 100vh
    font-family: Philosopher, serif
    font-size: 28px
    .content
      width: 700px
      margin: 50px auto 0 auto
      .title
        text-align: center
      .login
        position: absolute
      .image
        text-align: center
        display: flex
        align-items: center
        img
          display: inline
          width: 400px
          height: 400px
        .buttons
          display: inline
          .button
            text-decoration: underline
            cursor: pointer
            user-select: none
            margin: 20px 0
            &:hover
              color: gray
            &:active
              color: black

</style>
