<template>
  <div class="Page" v-if="shown">
    <Deanonymizer/>
    <site-header/>
    <storage-site-body/>
  </div>
</template>

<script>
  import SiteHeader from "~/components/shared/SiteHeader";
  import StorageSiteBody from "../components/unit-storage/StorageSiteBody";
  import Deanonymizer from "~/components/Deanonymizer";

  export default {
    name: "NewPage",
    components: {
      StorageSiteBody,
      SiteHeader,
      Deanonymizer},
    data:function () {
      return{
        shown:false,
      }
    },
    mounted:function(){
      this.shown = true;
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
    overflow-y: scroll
    margin: 0
    .hidden
      display: none
    .btn
      cursor: default
  body.scrollDisable
    overflow-y: scroll
    //max-height: 100vh
    .Page
      height: 100vh
      overflow-y: hidden



</style>
