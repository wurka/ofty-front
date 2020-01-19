<template>
  <div class="mainGroupBar">
    <div class="header">
      Категории товаров
    </div>
    <div class="pics">
      <img v-for="pic in picArr" :src="pic"/>
    </div>

  </div>
</template>

<script>
  export default {
    name: "mainGroupBar",
    data: function () {
      return {
        picArr: [
          './dist/uriy.svg','./dist/uriy.svg','./dist/uriy.svg',
          './dist/uriy.svg','./dist/uriy.svg','./dist/uriy.svg',
          './dist/uriy.svg','./dist/uriy.svg','./dist/uriy.svg',
          './dist/uriy.svg','./dist/uriy.svg','./dist/uriy.svg',
          './dist/uriy.svg','./dist/uriy.svg','./dist/uriy.svg',
          './dist/uriy.svg','./dist/uriy.svg','./dist/uriy.svg',
        ]
      }
    }
  }
</script>

<style lang="sass" scoped>
  .mainGroupBar
    text-align: center
    .header
      margin: auto
      margin-top: 30px
      font-size: 31px
      width: 600px
    .pics
      width: 1000px
      margin: auto
      img
        height: 64px
        width: 64px
        margin: 20px
</style>
