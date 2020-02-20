<template>
  <div class="StorageSiteBody">
    <div id="layout">
      <div class="left">
        <OfficeMenu/>
      </div>
      <div class="right">
        <decor-header :showAdd="showAdd" ref="decorHeader"  @decor-search="onDecorSearch" @hide-add-decor="showAdd=false"></decor-header>
        <decor-body :filter="decorSearchVal" @add-decor-click="showAdd=true; " @edit-decor="editDecor"></decor-body>
      </div>
    </div>
  </div>
</template>

<script>
  import BtnBar from "~/components/shared/BtnBar";
  import DecorHeader from "./DecorHeader";
  import DecorBody from "./DecorBody";
  import OfficeMenu from "../shared/OfficeMenu";
  export default {
    name: "StorageSiteBody",
    components: {DecorBody, DecorHeader, BtnBar, OfficeMenu},
    data: function () {
      return {
        decorSearchVal:'',
        showAdd: false,
      }
    },
    methods:{
      onDecorSearch:function (val) {
        this.decorSearchVal=val;
      },
      editDecor: function(params){
        //this.editParams = params;
        //this.showAdd=true;
        console.log(params);
        this.$refs.decorHeader.decorAdd.show(params);
        console.log('siteBody');
      }
    }
  }
</script>

<style lang="sass" scoped>
  .StorageSiteBody
    //background-color: lightblue
    .BtnBar
      vertical-align: top
    #layout
      //background-color: aquamarine
      display: flex
      width: 879px
      .left
        padding: 0 0 0 13px
      .right
        margin: 0 0 0 15px



</style>
