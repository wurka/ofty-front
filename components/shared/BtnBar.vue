<template>
    <div class="BtnBar">
      <div class="btn" v-for="btn in btns" :key="btn.id">
        <span class="name">{{btn.text}}</span>
        <span class="counter">{{btn.counter}}</span>
      </div>
    </div>
</template>

<script>
    export default {
        name: "BtnBar",
        props:[''],
        data:function () {
          return {
            btns:[{text:'Настройки профиля'},
              {text:'Сообщения',counter:15},
              {text:'Запросы от клиентов',counter:1},
              {text:'Мои заказы'},
              {text:'Календарь'},
              {text:'Мой декор'},
              {text:'Мои коллекции'},
              {text:'Оплата'}],
          }
        }
    }
</script>

<style lang="sass" scoped>
  $lgray: #f6f6f6
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  .BtnBar
    background-color: $lgray
    width: 224px
    display: inline-block
    padding: 8px 0 8px 0
    box-shadow: $shadow
    //text-shadow: 0px 4px 8px gray
    margin-left: 18px
    .btn
      display: block
      //background-color: white
      //border: solid black 1px
      //padding: 5px 5px 5px 10px
      height: 24px
      padding: 8px 15px 8px 15px
      font-size: 18px
      .counter
        font-weight: bold
        float: right

</style>
