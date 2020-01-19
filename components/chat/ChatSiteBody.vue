
<template>
  <div class="ChatSiteBody">
    <btn-bar :btns="[{text:'Настройки профиля'},
        {text:'Календарь'},
        {text:'Мои заказы'},
        {text:'Запросы от клиентов'},
        {text:'Мой декор'},
        {text:'Оплата'},
        {text:'Мои коллекции'}]">
    </btn-bar>
    <div id="layout">
      <chat-header></chat-header>
      <dialogs></dialogs>


    </div>
  </div>
</template>

<script>
  import BtnBar from "./BtnBar";
  import ChatHeader from "./ChatHeader";
  import Dialogs from "./Dialogs";
  export default {
    name: "ChatSiteBody",
    components: {Dialogs, ChatHeader, BtnBar},
    data: function () {
      return {
        decorSearchVal:'',
        showAdd: false,
      }
    },
  }
</script>

<style lang="sass" scoped>
  .ChatSiteBody
    //background-color: lightblue
    .BtnBar
      vertical-align: top
    #layout
      //background-color: aquamarine
      display: inline-block
      padding-left: 15px
      width: 879px
</style>
