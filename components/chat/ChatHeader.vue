<template>
    <div class="ChatHeader">
      <div class="btn">+ Написать сообщение</div>
      <span><search-bar text="Поиск по сообщениям"></search-bar></span>
    </div>
</template>

<script>
    export default {
        name: "ChatHeader",
        data: function () {
            return {}
        }
    }
</script>

<style lang="sass" scoped>
  $lgray: #f6f6f6
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  .ChatHeader
    //background-color: lightpink
    //text-align: right
    .btn
      display: inline-block
      background-color: white
      //border: solid $lgray 1px
      padding: 8px 0 8px 20px
      //margin: 5px
      box-shadow: $shadow
      font-size: 18px
      width: 210px
    .SearchBar
      //margin-right: 25px
      margin-left: 25px

</style>
