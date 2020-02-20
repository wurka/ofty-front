<template>
    <div class="SettingsSiteBody">
      <div class="menu">
        <OfficeMenu/>
      </div>
      <div id="layout">
        <account-info></account-info>
      </div>

    </div>
</template>

<script>
    import OfficeMenu from "../shared/OfficeMenu";
    import AccountInfo from "./AccountInfo";
    export default {
        name: "SettingsSiteBody",
      components: {AccountInfo, OfficeMenu},
      data: function () {
            return {}
        }
    }
</script>

<style lang="sass" scoped>
  .SettingsSiteBody
    display: flex
    .BtnBar
      vertical-align: top
  .menu
    width: 224px
    margin: 0 13px 3px 13px
  #layout
    display: inline-block
    padding-left: 15px
    width: 879px
</style>
