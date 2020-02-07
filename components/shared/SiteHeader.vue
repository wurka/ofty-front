<template>
  <div class="SiteHeader">
    <a href="/">
      <img class="HeaderLogo" :src="host+'/static/img/shared/logo.png'" />
    </a>

    <div class="rightPanel">
      <tab-bar></tab-bar>
      <search-bar text="Поиск по сайту"></search-bar>
      <user-bar></user-bar>
    </div>

  </div>
</template>

<script>
    import CityBlock from "./CityBlock";
    import TabBar from "./TabBar";
    import SearchBar from "./SearchBar";
    import UserBar from "./UserBar";
    import axios from "axios";
    import {blockBailAndCost} from "~/static/myTools.js";
    export default {
      name: "SiteHeader",
      components: {UserBar, SearchBar, TabBar, CityBlock},
      data: function () {
          return{
            host:this.$store.state.host,
          }
        },
      methods:{
        home:function () {
          document.location='#';
        },
        downloadBasket(){
          let now = new Date(),
              year = now.getFullYear(),
              month = now.getMonth()+1,
              day = now.getDate();
          axios
            .get(this.$store.state.host + "/basket/get-content")
            .then((response)=>{
              let count = 0;
              response.data.forEach((block)=>{
                block['units'].forEach((item)=>{
                  if (item.type === 'unit'){count += 1;}
                  item['order-count'] = 1;
                });

                block['commentary'] = '';
                block['from'] = day.toString()+"."+month+"."+year;
                block['to'] = (day+1).toString()+"."+month+"."+year;
                let bac = blockBailAndCost(block);
                block['bail'] = bac.bail;
                block['cost'] = bac.cost;
                block['ok'] = bac.ok;
              });
              this.$store.state.basket.blocks = response.data;
              this.$store.state.basket.count = count;
            })
            .catch(()=>{console.warn('error while download basket')})
        },
      },
    }
</script>

<style lang="sass" scoped>
  .SiteHeader
    background: white
    padding-left: 18px
    padding-top: 19px
    height: 102px
    .HeaderLogo
      margin-top: 2px
    .rightPanel
      display: inline-block
      vertical-align: top
      width: 928px
    .SearchBar
      margin-top: 20px
      margin-left: 308px
</style>

<style lang="sass" >
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  $lgray: #f6f6f6
  $myblue: #182b93
  $myred: #CA1612

  .btn
    box-shadow: $shadow
    background-color: white
    //border: white solid 0.1px
    &:hover
      background-color: #f5f5f5
    &:active
      transform: scale(0.99)
      //border: gray solid 0.1px
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5)
  .warning
    font-family: Tahoma, serif
    color: $myred
  input
    border: thin solid lightgray
    font-family: Tahoma, serif
  textarea
    font-family: Tahoma, serif
    border: thin solid lightgray
  input.invalid
    border-color: $myred
    outline-color: $myred
  textarea.invalid
    border-color: $myred
    outline-color: $myred
  select
    border: thin solid lightgray
    font-family: Tahoma, serif
</style>
