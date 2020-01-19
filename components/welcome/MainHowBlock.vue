<template>
  <div class="MainHowBlock">
    <div class="header">
      Как это работает?
    </div>
    <img v-for="pic in picArr" :src="pic"/>
  </div>
</template>

<script>
  export default {
    name: "MainHowBlock",
    data: function () {
      return {
        picArr: ['./dist/uriy.svg']
      }
    }
  }
</script>

<style lang="sass" scoped>
  .MainHowBlock
    //background-color: red
    text-align: center
    .header
      margin: auto
      margin-top: 30px
      margin-bottom: 30px
      font-size: 31px
      width: 600px
    img
      background-color: lightgray
      height: 900px
      width: 1100px
      //margin: 15px
</style>
