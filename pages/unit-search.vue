<template>
  <div class="Page">
    <SiteHeader ref="siteHeader"/>
    <!-- <SearchSiteBody/> -->
    <div class="myBody">
      <OfficeMenu/>
      <SearchBody @loginRequest="()=>{this.$refs.siteHeader.showLoginDialog()}"/>
    </div>
  </div>
</template>

<script>
  import SiteHeader from "~/components/shared/SiteHeader";
  // import SearchSiteBody from "../components/unit-search/SearchSiteBody";
  import OfficeMenu from "../components/shared/OfficeMenu";
  import SearchBody from "../components/unit-search/SearchBody";
  export default {
    name: "NewPage",
    components: {
      // SearchSiteBody,
      SearchBody,
      OfficeMenu,
      SiteHeader},
    data:function () {
      return{
        scrollDisabled:false,
      }
    },
    layout:'default'
  }
</script>

<style lang="sass" scoped>
  .Page
    width: 1140px
    //margin-left: 130px
    margin: auto
    background-color: white
    min-height: 100vh
  .myBody
    display: flex

</style>

<style lang="sass">
  body
    background-color: lightgrey
    margin: 0
    font-family: philosopher, serif
    .hidden
      display: none
    .btn
      cursor: pointer
    .scrollDisable
      overflow-y: scroll
      //max-height: 100vh
      .Page
        height: 100vh
        overflow-y: hidden



</style>
