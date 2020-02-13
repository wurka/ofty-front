<template>
    <div class="TabBar">
      <city-block :shown="showCities"></city-block>
      <a class="tab" href="/news">
        <span class="tab_text" >новости</span>
      </a>
      <a class="tab" href="/rules">
        <span class="tab_text">правила</span>
      </a>
      <a class="tab" href="/sets">
        <span class="tab_text" >коллекции</span>
      </a>
      <a class="tab" href="/unit-search">
        <span class="tab_text" >поиск</span>
      </a>
      <a class="tab" href="/account-settings">
        <span class="tab_text" >личный кабинет</span>
        <img :src="host+'/static/img/shared/message-24.png'"/>
      </a>
      <div class="tab">
        <span class="tab_text" >{{city}}</span>
        <img :src="host+'/static/img/shared/selection-20.png'" />
      </div>
    </div>
</template>

<script>
    import CityBlock from "./CityBlock";

    export default {
      name: "TabBar",
      components: {CityBlock},
      data:function(){
        return{
          city: 'Москва',
          showCities: 0,
          host:this.$store.state.host,
        }
      },
      methods:{
      }
    }
</script>

<style lang="sass" scoped>
  a
    color: black
    &:link
      text-decoration: none
      color: black
    &:visited
      color: black
  .TabBar
    //margin-bottom: 30px
    //width: inherit
    margin-left: 50px
    .tab
      display: inline
      margin-right: 45px
      //font-family: cursive
      font-size: 21px
      //margin: 10px
      //background-color: aliceblue
      user-select: none
      cursor: pointer
      &:hover
        text-decoration: underline
      &:active
        color: gray
      &:last-child
        //margin-left: 74px
        margin: 0 48px 0 0
        font-size: 18px
        //background-color: orangered
        float: right
      img
        //height: 18px
        margin-left: 5px
        vertical-align: text-bottom

</style>
