<template>
    <div class="MainPlusBar">
        <div class="plusCard" v-for="plus in plusArr">
          <div class="plusTitle">{{plus.title}}</div>
          <div class="plusText">{{plus.text}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MainPlusBar",
        data: function () {
            return {
              plusArr:[
                {'title': 'Спецпредолжения', 'text': 'Вы не пропустите скидки, устраиваемые компаниями, эта информация будет отображаться на сайте.'},
                {'title': 'Удобный поиск', 'text': 'С помощью нашего сайта вы экономите свое время, весь декор собран в одном месте. Благодаря продуманной системе поиска вы легко найдете то, что искали по минимальной цене'},
                {'title': 'Календарь', 'text': 'Все проводимые сделки и сроки их проведения будут всегда под рукой, что позволит вам вовремя забрать и отдать декор'},
              ]
            }
        }
    }
</script>

<style lang="sass" scoped>
  $lgray: #f6f6f6
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  .MainPlusBar
    //background-color: red
    margin-top: 25px
    .plusCard
      display: inline-block
      width: 316px
      height: 150px
      vertical-align: top
      text-align: center
      //background-color: $lgray
      font-size: 15.5px
      margin-left: 30px
      padding: 15px
      box-shadow: $shadow
      &:first-child
        margin-left: 0
      .plusTitle
        font-size: 24px
        margin-bottom: 20px
</style>
