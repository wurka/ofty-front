<template>
  <div class="layout">
    <SiteHeader/>
    <div class="flex">
      <OfficeMenu/>
    </div>
  </div>
</template>

<script>
  import SiteHeader from "../components/shared/SiteHeader";
  import OfficeMenu from "../components/shared/OfficeMenu";

  export default {
    name: "news",
    components: {SiteHeader, OfficeMenu},
  }
</script>

<style scoped lang="sass">
  .layout
    width: 1140px
    margin: auto
    background: white

</style>
