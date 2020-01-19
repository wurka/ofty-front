<template>
    <div class="MainSiteBody">
      <main-title-block></main-title-block>
      <main-plus-bar></main-plus-bar>
      <main-col-bar></main-col-bar>
      <main-group-bar></main-group-bar>
      <main-how-block></main-how-block>
    </div>
</template>

<script>
    import MainTitleBlock from "./MainTitleBlock";
    import MainPlusBar from "./MainPlusBar";
    import MainColBar from "./MainColBar";
    import MainGroupBar from "./MainGroupBar";
    import MainHowBlock from "./MainHowBlock";
    export default {
        name: "MainSiteBody",
      components: {MainHowBlock, MainGroupBar, MainColBar, MainPlusBar, MainTitleBlock},
      data: function () {
            return {}
        }
    }
</script>

<style lang="sass" scoped>
    .MainSiteBody
        //background-color: lightcyan
        margin-left: 15px
        margin-right: 15px
    .BtnBar
      vertical-align: top
    /*#layout
      //background-color: aquamarine
      display: inline-block
      padding-left: 15px
      width: 879px
</style>
