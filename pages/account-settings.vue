<template>
  <div class="Page">
    <site-header/>

    <settings-site-body/>
  </div>
</template>

<script>
    import SiteHeader from "~/components/shared/SiteHeader";
    import SettingsSiteBody from "~/components/account-settings/SettingsSiteBody";
    export default {
        name: "NewPage",
        components: {
          SettingsSiteBody,
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
