<template>
  <div class="FavorCard">
    <div class="leftPanel">
      <div class="company">{{params.company}}</div>
      <div class="conditions">Условия доставки:<br>{{params.conditions}}</div>
    </div>
    <div class="rightPanel">
      <div v-for="u in params.units" class="unit">
        <input type="checkbox" class="cb"/>
        <img src="" class="pic"/>
        <div class="col1">
          <div class="name">{{u.name}}</div>
          <div class="groupParams">
            <div v-for="p in u.groupParams" class="param">{{p.title}} = {{p.value}}{{p.dimension}}</div>
          </div>
        </div>
        <div class="col2">
          <div class="count">
            Количество: <input/> шт.
          </div>
          <div class="cost">Стоимость первых суток: {{u.firstDayCost}}р</div>
          <div class="cost">Стоимость последующих суток: {{u.dayCost}}р</div>
          <div class="bail">Залог: {{u.bail}}р</div>
        </div>
        <div class="btns">
          <div class="btn" >В избранное</div>
          <div class="btn" >Удалить</div>
        </div>
      </div>
    </div>
    <div class="botPanel">
      <div class="line">
        <div class="col">
          Начало аренды: <input/>
        </div>
        <div class="col">
          Окончание срока аренды: <input/>
        </div>
        <div class="col">
          Стоимость товаров: {{totalCost}} р<br>
          Залог: {{totalBail}} р
        </div>
      </div>
      <div class="line">
        <div class="label">Комментарий:</div>
        <textarea></textarea>
      </div>
      <div class="line">
        <div class="btn" >Отправить запрос</div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "FavorCard",
        data: function () {
            return {
              params: {
                company: '4 KOTA',
                conditions: 'Забрать и привезти вовремя, в коробках с бантиком. Желательно тортик еще прив...',
                units:[{name:'Table round', firstDayCost: 58000, dayCost: 51000, bail:4000, groupParams:[{title:'H', value: 15, dimension: 'cm'},{title:'H', value: 15, dimension: 'cm'},{title:'H', value: 15, dimension: 'cm'},{title:'H', value: 15, dimension: 'cm'},{title:'H', value: 15, dimension: 'cm'},{title:'H', value: 15, dimension: 'cm'}]}],
              },

            }
        },
        computed: {
          totalCost: function () {
            let ans=0;
            for (let i in this.params.units){
              ans += this.params.units[i].dayCost;
            }
            console.log(1);
            return ans;
          },
          totalBail: function () {
            let ans=0;
            for (let i in this.params.units){
              ans += this.params.units[i].bail;
            }
            console.log(1);
            return ans;
          }
        },
    }
</script>

<style lang="sass" scoped>
  $lgray: #f6f6f6
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  $myred: #CA1612
  .FavorCard
    //background-color: lightgray
    margin: 20px 15px 0 30px
    .btn
      background-color: white
      box-shadow: $shadow
      text-align: center
      width: 190px
      padding: 10px 0 10px 0
      font-size: 15.5px
    .leftPanel
      width: 205px
      display: inline-block
      vertical-align: top
      .company
        font-size: 21px
        margin-bottom: 5px
      .conditions
        font-size: 15.5px
    .rightPanel
      display: inline-block
      background-color: $lgray
      width: 870px
      min-height: 130px
      vertical-align: top
      .cb
        position: relative
        height: 27px
        width: 27px
        margin: 0 -30px 0 0
        //z-index: 1
      .pic
        background-color: lightsalmon
        margin-top: 15px
        margin-left: 15px
        height: 100px
        width: 100px
        vertical-align: top
        //z-index: 0
      .col1
        display: inline-block
        margin-top: 15px
        margin-left: 15px
        vertical-align: top
        .name
          font-size: 21px
        .groupParams
          margin-top: 10px
          width: 210px
          .param
            display: inline-block
            width: 100px
      .col2
        display: inline-block
        margin-top: 45px
        margin-left: 15px
        vertical-align: top
        .count
          input
            width: 60px
            height: 14px
            vertical-align: bottom
      .btns
        display: inline-block
        float: right
        margin-top: 20px
        margin-right: 15px
        .btn
          margin-bottom: 15px
    .botPanel
      margin-left: 210px
      .line
        margin-top: 20px
        .col
          display: inline-block
          vertical-align: top
          margin-right: 40px
          input
            height: 20px
            width: 80px
            margin-left: 10px
        .label
          display: inline-block
          vertical-align: top
        textarea
          margin-left: 22px
          resize: none
          width: 735px
          height: 75px
        .btn
          text-align: center
          margin: auto

</style>
