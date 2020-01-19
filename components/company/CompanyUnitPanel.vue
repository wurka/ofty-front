<template>
  <div class="CompanyUnitPanel">
    <div class="header">
      <div class="text">
        <div class="btn active">Товары/</div>
        <div class="btn">Коллекции</div>
      </div>
      <search-bar text="Поиск по товарам компании"></search-bar>
    </div>
    <div class="body">
      <div v-if="!cardArr" class="zeroResult">Ничего не найдено. Измените параметры для поиска. </div>
      <div v-else v-for="card in cardArr" :key="card.id" :class="[(card.type=='unit') ? 'inline' : '']">
        <div v-if="card.type=='header1'" class="group">{{card.text}}</div>
        <div v-if="card.type=='header2'" class="subgroup">{{card.text}}</div>
        <div v-if="card.type=='unit'"  class="unitCard">
          <img class="photo" :src="card.photo"/>
          <div class="dayCost text">{{card['day-cost']}}, р/сут</div>
        </div>
      </div>
    </div>

    <div class="inputPanel">
      <div class="menu"></div>
      <div class="name">4 KOTA</div>

      <textarea placeholder="Напишите сообщение"></textarea>
      <div class="add"></div>
    </div>
  </div>
</template>

<script>
  import {ax,host} from "./main";

  export default {
      name: "CompanyUnitPanel",
      data: function () {
          return {
            host:host,
            loadReady: true,
            cardArr:[],
            unitsParams: {'offset': 0,'size': 1,'filter': '', 'last-group-id':-1},
          }
      },
      methods:{
        loadCards:function () {
          if (!this.loadReady){
            console.log('Too fast ajax');
            return;
          }
          this.loadReady = false;
          let vm = this;
          if(vm.cardArr.length>0)vm.unitsParams['last-group-id']=vm.cardArr[vm.cardArr.length-1].group;
          else vm.unitsParams['last-group-id']= -1;
          ax.get(host+'/units/get-my-units',{'params':vm.unitsParams})
            .then(function(data){
                console.log(data);
                vm.cardArr = vm.cardArr.concat(data.data);
                vm.unitsParams.offset += vm.unitsParams.size;
                vm.loadReady = true;
                      vm.cardArr.push({'type':'unit' ,'id':3, 'photo':'http://localhost:9000/static/user_0/unit_1/photo1.jpg', "day-cost": 1212.0});
                      vm.cardArr.push({'type':'unit' ,'id':4, 'photo':'http://localhost:9000/static/user_0/unit_1/photo4.jpg', "day-cost": 1212.0});
                      vm.cardArr.push({'type':'unit' ,'id':5, 'photo':'http://localhost:9000/static/user_0/unit_1/photo1.jpg', "day-cost": 1212.0});
                      vm.cardArr.push({'type':'unit' ,'id':6, 'photo':'http://localhost:9000/static/user_0/unit_1/photo1.jpg', "day-cost": 1212.0});
                      vm.cardArr.push({'type':'unit' ,'id':14, 'photo':'http://localhost:9000/static/user_0/unit_1/photo4.jpg', "day-cost": 1212.0});
                      vm.cardArr.push({'type':'unit' ,'id':15, 'photo':'http://localhost:9000/static/user_0/unit_1/photo1.jpg', "day-cost": 1212.0});
                      vm.cardArr.push({'type':'unit' ,'id':16, 'photo':'http://localhost:9000/static/user_0/unit_1/photo1.jpg', "day-cost": 1212.0});
                vm.$forceUpdate();
              }
            )
            .catch(function (data) {
                if(data.response){
                  console.warn(data.response.data);
                }
                else
                  console.warn('no connection')
              }
            );
        },
      },
      created: function () {
        this.loadCards();
      },
    }
</script>

<style lang="sass" scoped>
  $lgray: #f6f6f6
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  $myred: #CA1612
  .CompanyUnitPanel
    //background-color: lightcyan
    width: 1100px
    min-height: 200px
    margin-left: 15px
    .header
      margin-top: 25px
      .text
        display: inline-block
        margin-left: 450px
        .btn
          display: inline-block
          cursor: pointer
          color: gray
          font-size: 24px
        .btn.active
          color: black
          font-size: 31px
      .SearchBar
        float: right
        margin-right: -9px
    .body
      .inline
        display: inline-block
      .group
        font-size: 31px
        padding: 15px 0 10px 0
      .subgroup
        font-size: 24px
        padding: 10px 0 10px 0
      .unitCard
        display: inline-block
        background-color: $lgray
        color: gray
        height: 190px
        margin-left: 28px
        margin-bottom: 10px
        font-size: 14px
        .photo
          height: 155px
          width: 155px
          box-shadow: $shadow
        .text
          margin-top: 5px
          margin-left: 12px
          text-align: left
    .inputPanel
      background-color: $lgray
      height: 290px
      width: 870px
      display: inline-block
      .name
        font-size: 24px
        margin: 20px 0 0 20px
        display: inline-block
      .menu
        float: right
        height: 32px
        width: 32px
        background-color: lightgray
        margin: 10px 10px 0 0
      textarea
        width: 760px
        height: 190px
        font-size: 18px
        resize: none
        padding-left: 30px
        padding-top: 10px
        padding-right: 40px
        display: inline-block
        margin-left: 20px
        margin-top: 20px
      .add
        display: inline-block
        height: 32px
        width: 32px
        background-color: lightgray
        vertical-align: top
        margin-left: -45px
        margin-top: 25px
        cursor: pointer

</style>
