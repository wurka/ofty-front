<template>
    <div class="SearchSidePanel">
      <div class="SearchBar">
        <input :placeholder="placeholder" v-model="filter"/>
        <img :src="host+'/static/img/shared/loupe-24.png'"/>
      </div>
      <div class="variants">
        <cascade-checkbox-variant label="Выбрать все" :children="myVariants" :filter="filter"> </cascade-checkbox-variant>
      </div>
    </div>
</template>

<script>
  import {myClone} from "~/static/myTools.js";
  import CascadeCheckboxVariant from "~/components/shared/CascadeCheckboxVariant";

  export default {
    name: "SearchSidePanel",
    components: {CascadeCheckboxVariant},
    props:['variants','placeholder'],
    data: function () {
      return {
        //placeholder: 'Поиск по категориям',
        myVariants:myClone(this.variants),
        filter:'',
        host:this.$store.state.host,
      }
    },
    watch:{
      filter:function () {
        let re = new RegExp('\"label\":\"'+this.filter,'gi');
        this.myVariants=myClone(this.variants);
        for (let i=this.variants.length-1; i>-1;i--){
          console.log( (JSON.stringify(this.variants[i])) )
          if (!re.exec(JSON.stringify(this.variants[i]))){
            this.myVariants.splice(i,1);
          }
        }
      }
    },
  }
</script>

<style lang="sass" scoped>
  .SearchSidePanel
    min-height: 650px
    width: 200px
    display: inline-block
    //background-color: gray
    .SearchBar
      //display: inline-block
      width: 180px
      margin-top: 20px
      margin-left: 10px
      input
        border: solid lightgray 1px
        width: 139px
        height: 37px
        vertical-align: middle
        font-size: 14px
        font-family: Philosopher
        padding-left: 10px
        padding-right: 25px
      img
        height: 24px
        vertical-align: top
        margin-top: 8px
        margin-left: -33px
        pointer-events: none
    .variants
      margin-left: 10px
      margin-top: 15px
      //width: fit-content
      //margin: auto
</style>
