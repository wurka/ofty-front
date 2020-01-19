<template>
    <div class="MainColBar">
        <div class="header">
          Здесь вы можете создавать свои тематические коллекции или воспользоваться существующими коллекциями
        </div>
        <img v-for="pic in picArr" :src="pic"/>
    </div>
</template>

<script>
    export default {
        name: "MainColBar",
        data: function () {
            return {
              picArr: ['./dist/uriy.svg','./dist/uriy.svg','./dist/uriy.svg','./dist/uriy.svg']
            }
        }
    }
</script>

<style lang="sass" scoped>
    .MainColBar
      //background-color: red
      text-align: center
      .header
        margin: auto
        margin-top: 30px
        font-size: 31px
        width: 810px
        margin-bottom: 15px
      img
        background-color: lightgray
        height: 220px
        width: 220px
        margin: 22px
</style>
