<template>
  <div class="Page">
    <site-header></site-header>
    <storage-site-body></storage-site-body>

  </div>
</template>

<script>
  import SiteHeader from "~/components/shared/SiteHeader";
  import StorageSiteBody from "../components/unit-storage/StorageSiteBody";
  export default {
    name: "NewPage",
    components: {
      StorageSiteBody,

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

</style>

<style lang="sass">
  body
    background-color: lightgrey
    margin: 0px
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
