<template>
  <div v-if="shown">
    <div class="bg"></div>
    <div class="DecorAddFill">
      <div class="content">
        <div v-html="text" class="FillText"></div>
        <div class="PriceList" >
          <div class="Offer" v-for="offer in priceList" :key="offer.id">
            <input type="checkbox"/> {{offer.name}} - {{offer.price}}
          </div>
        </div>
        <div class="btn" >Отправить запрос</div>
        <div class="btn" >Узнать подробности</div>
        <div class="btn" @click="hideAddFill()">Отменить</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "DecorAddFill",
    props:['shown'],
    data: function () {
      return {
        text: 'Если нет времени заполнять информацию о товарах, наши бравые помощники с удовольствием сделают это за Вас. <br/><br/><br/>' +
              'Все что Вам нужно - выбрать необходимые услуги:',
        priceList: [{'name':'скопировать информацию с сайта','price':'30 р/шт'}, {'name':'сфотографировать товар','price':'100 р/шт'} ,
          {'name':'измерить размер товара','price':'50р/шт'},{'name':'скопировать информацию на сайт из файла','price':'30 р/шт'},
          {'name':'выезд помощника в пределах МКАД','price':'1000 р'}, {'name':'выезд помощника в МО','price':'2000 р' }]
      }
    },
    methods:{
      hideAddFill: function () {
        console.log('hideAddFill');
        this.$emit('hideAddFill');
      }
    }

  }
</script>

<style lang="sass" scoped>
  $lgray: #f6f6f6
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  .bg
    background-color: darkgray
    opacity: 0.3
    position: fixed
    left: 0
    top: 0
    height: 100vh
    width: 100vw
    z-index: 2
  .DecorAddFill
    border: solid darkgray thin
    box-shadow: $shadow
    background-color: white
    //height: 110%
    //width: 90%
    position: absolute
    //padding: 160px
    margin-top: -10px
    margin-left: 40px
    width: 1010px
    height: 710px
    font-family: Philosopher
    font-size: 18px
    z-index: 3
    .content
      margin-top: 108px
      margin-left: 176px
      .FillText
        //margin-top: 160px
        width: 684px
        height: 192px
        //font-size: 21px

      .PriceList
        //padding: 50px
        //margin-left: 160px
        font-family: Tahoma
        margin-left: 35px
        //font-size: 21px
        margin-bottom: 100px
        .Offer
          input
            vertical-align: top
            width: 27px
            height: 27px
            margin: 0 35px 5px 0
      .btn
        display: inline-block
        font-size: 18px
        margin-right: 40px
        border: solid lightgrey 1px
        text-align: center
        padding: 8px 5px 8px 10px
        box-shadow: $shadow
        width: 200px
</style>
