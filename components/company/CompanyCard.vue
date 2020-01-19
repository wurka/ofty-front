<template>
    <div class="CompanyCard">
      <div class="topPanel">
        <div class="col col1">
          <img src="" class="pic"/>
          <div class="t1">На сайте с {{paramDict.regTime}}</div>
        </div>
        <div class="col col1">
          <div class="name">{{paramDict.name}}</div>
          <div class="site">{{paramDict.site}}</div>
          <div class="btn">Поблагодарить</div>
          <div class="btn">Пожаловаться</div>
        </div>
        <div class="col col2">
          <div class="cupPanel">

            <div v-for="i in [1,2,3,4,5,6,7]" class="cup"></div>
            <div class="bBtn"></div>
            <div class="fBtn"></div>
          </div>
          <div class="t1">рейтинг</div>
          <div class="t2">{{paramDict.rating}}</div>
        </div>
        <div class="col col3">
          <div v-for="c in paramDict.contacts" class="contact">{{c}}</div>
          <div class="btn">Написать сообщение</div>
        </div>
      </div>
      <div class="botPanel">
        <div class="line">{{paramDict.description}}</div>
        <div class="line"><b>Адрес склада: </b>{{paramDict.address}}</div>
        <div class="line">
          <div class="deliveryPanel">
            <div class="label">Стоимость доставки: </div>
            <div class="deliveryList">
              <div v-for="i in paramDict.delivery" class="delivery">{{i.name}} - {{i.value}}</div>
            </div>
          </div>
          <div class="timePanel">
            <div class="label">Время работы: </div>
            <div class="timeList">
              <div v-for="i in [0,1,2,3]" class="time"><div class="name">{{paramDict.workTime[i].name}}</div><div class="value">{{paramDict.workTime[i].value}}</div></div>
            </div>
            <div class="timeList">
              <div v-for="i in [4,5,6]" class="time"><div class="name">{{paramDict.workTime[i].name}}</div><div class="value">{{paramDict.workTime[i].value}}</div></div>
            </div>
          </div>
        </div>
        <div class="line">{{paramDict.comment}}</div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "CompanyCard",
        data: function () {
            return {
              paramDict:{
                'name':'4 KOTA',
                'site':'www.4kota.ru',
                'regTime':'25.02.19',
                'contacts': ['8-913-433-76-88', '8-913-433-76-47', 'asdgfsd@jfksahf.ru'],
                'rating': 357,
                'description':'Мы компания, которая занимается арендой всю сознательную жизнь. Мы Боги декора.',
                'address': 'г. Москва, ул. Перепелкина, 163 (м. Новослободская)',
                'comment': 'Декор упакован в коробки, нарушение их целостности ведет за собой штрафы.',
                'delivery': [{'name':'Самовывоз со склада', 'value':'бесплатно'},
                  {'name':'Доставка внутри МКАД', 'value':'450р'},
                  {'name':'Доставка за пределы МКАД', 'value':'не возможна'},
                  {'name':'Доставка до квартиры', 'value':'1500р'},],
                'workTime': [{'name':'Пн', 'value':'9:00 - 21:00'},
                  {'name':'Вт', 'value':'9:00 - 21:00'},
                  {'name':'Ср', 'value':'9:00 - 21:00'},
                  {'name':'Чт', 'value':'9:00 - 21:00'},
                  {'name':'Пт', 'value':'9:00 - 16:00'},
                  {'name':'Сб', 'value':'Выходной'},
                  {'name':'Вс', 'value':'Выходной'},],
              }
            }
        }
    }
</script>

<style lang="sass" scoped>
  $lgray: #f6f6f6
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  $myred: #CA1612
  .CompanyCard
    background-color: $lgray
    box-shadow: $shadow
    width: 1100px
    //min-height: 500px
    margin-left: 15px
    .col
      display: inline-block
      vertical-align: top
    .btn
      display: inline-block
      background-color: white
      padding: 8px 0 8px 0
      box-shadow: $shadow
      text-align: center
      font-size: 18px
      width: 170px
    .topPanel
      //background-color: lightgray
      .col1
        margin-top: 20px
        margin-left: 30px
        width: 170px
        .pic
          height: 170px
          width: 170px
          background-color: lightsalmon
        .t1
          text-align: center
        .btn
          margin-bottom: 8px
        .name
          font-size: 24px
          font-weight: bold
          margin-bottom: 5px
        .site
          font-size: 24px
          margin-bottom: 30px
      .col2
        margin-top: 20px
        margin-left: 10px
        width: 452px
        .cupPanel
          .cup
            background-color: lightsalmon
            display: inline-block
            width: 64px
            height: 64px
          .bBtn
            background-color: gray
            cursor: pointer
            display: inline-block
            margin-left: -455px
            width: 20px
            height: 64px
          .fBtn
            background-color: gray
            cursor: pointer
            display: inline-block
            margin-left: 407px
            width: 20px
            height: 64px
        .t1
          margin-top: 40px
          font-size: 21px
          margin-bottom: 5px
        .t2
          font-size: 31px
      .col3
        margin-top: 20px
        margin-left: 10px
        .contact
          font-size: 21px
          text-align: right
          margin-bottom: 5px
        .btn
          margin-top: 20px
          width: 200px
    .botPanel
      margin-left: 30px
      font-size: 18px
      padding-bottom: 30px
      .line
        margin-top: 15px
        .label
          font-weight: bold
          display: inline-block
          vertical-align: top
        .deliveryPanel
          vertical-align: top
          display: inline-block
          font-size: 15.5px
          width: 530px
          .deliveryList
            display: inline-block
            margin-left: 10px
            .delivery
              margin-bottom: 5px
        .timePanel
          vertical-align: top
          display: inline-block
          font-size: 15.5px
          width: 530px
          .timeList
            vertical-align: top
            display: inline-block
            margin-left: 30px
            .time
              margin-bottom: 5px
              .name
                width: 20px
                display: inline-block
              .value
                margin-left: 15px
                display: inline-block

</style>
