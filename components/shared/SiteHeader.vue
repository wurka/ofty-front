<template>
  <div class="SiteHeader">
    <img class="HeaderLogo" :src="host+'/static/img/shared/logo.png'"/>
    <div class="rightPanel">
      <tab-bar></tab-bar>
      <search-bar text="Поиск по сайту"></search-bar>
      <user-bar></user-bar>
    </div>

  </div>
</template>

<script>
    import CityBlock from "./CityBlock";
    import TabBar from "./TabBar";
    import SearchBar from "./SearchBar";
    import UserBar from "./UserBar";
    export default {
      name: "SiteHeader",
      components: {UserBar, SearchBar, TabBar, CityBlock},
      data: function () {
          return{
            host:this.$store.state.host,
          }
        },
    }
</script>

<style lang="sass" scoped>
  .SiteHeader
    padding-left: 18px
    padding-top: 19px
    height: 102px
    .HeaderLogo
      margin-top: 2px
    .rightPanel
      display: inline-block
      vertical-align: top
      width: 928px
    .SearchBar
      margin-top: 20px
      margin-left: 308px
</style>

<style lang="sass" >
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  $lgray: #f6f6f6
  $myblue: #182b93
  $myred: #CA1612

  .btn
    box-shadow: $shadow
    background-color: white
    //border: white solid 0.1px
    &:hover
      background-color: #f5f5f5
    &:active
      transform: scale(0.99)
      //border: gray solid 0.1px
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5)
  .warning
    font-family: Tahoma
    color: $myred
  input
    border: thin solid lightgray
  textarea
    border: thin solid lightgray
  input.invalid
    border-color: $myred
    outline-color: $myred
</style>
