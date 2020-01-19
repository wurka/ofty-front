<template>
    <div class="SettingsSiteBody">
      <btn-bar></btn-bar>
      <div id="layout">
        <account-info></account-info>
      </div>

    </div>
</template>

<script>
    import BtnBar from "~/components/shared/BtnBar";
    import AccountInfo from "./AccountInfo";
    export default {
        name: "SettingsSiteBody",
      components: {AccountInfo, BtnBar},
      data: function () {
            return {}
        }
    }
</script>

<style lang="sass" scoped>
  .SettingsSiteBody
    .BtnBar
      vertical-align: top
  #layout
    display: inline-block
    padding-left: 15px
    width: 879px
</style>
