<template>
    <div class="SearchSiteBody">
      <search-side-panel class="leftPanel sidePanel" :variants="leftVars" :placeholder="'Поиск по категориям'"></search-side-panel>
      <div class="midPanel">
        <div class="params">
          <div class="hideBtn">Скрыть</div>
          <div class="picPanel"></div>
          <div class="groupPanel">
            <div v-for="p in groupParams" :key="p.id" class="genParam" >
              <div class="label">{{p.name}}</div>
              <input class="text"/>
            </div>
          </div>
          <div class="genPanel">
            <div v-for="p in genParams" :key="p.id" class="genParam" >
              <div class="label">{{p.name}}</div>
              <input class="text"/>
            </div>
          </div>
          <div class="colorPanel" v-if="false">
            <color-picker-mini :colorData="colorData" :picked="pickedColors"></color-picker-mini>
          </div>
        </div>
        <div class="results">
          <div v-if="!results" class="zeroResult">Ничего не найдено. Измените параметры для поиска. </div>
          <div v-else class="resultPanel">
            <div class="topLine">

            </div>
            <div v-for="card in results" :key="card.id" class="searchCard">
              <img class="photo" :src="card['photo1']"/>
              <img class="cartBtn" :src="host+'/static/img/shared/basket-32.png'" @click="addToBasket(card.id);"/>
              <div class="idLabel">{{card.id}}</div>
              <div class="dayCost text">{{card['day-cost']}}, р/сут</div>
            </div>
          </div>

          <div class="fixbtn" @click="generateOrder">GenerateOrder</div>

        </div>
      </div>
      <search-side-panel class="rightPanel sidePanel" :variants="rightVars" :placeholder="'Поиск по компаниям'"></search-side-panel>
    </div>
</template>

<script>
    import SearchSidePanel from "./SearchSidePanel";
    var ax;
    import DecorCard from "~/components/unit-storage/DecorCard";
    import ColorPickerMini from "./ColorPickerMini";

    export default {
      name: "SearchSiteBody",
      components: {ColorPickerMini,DecorCard, SearchSidePanel},
      data: function () {
            return {
              //leftVarsOrigin:[{'id': 3,'label':'Вазы', 'children':[{'id': 2,'label':"аквариумы"},{'id': 4,'label':"конусы"}]},{'id': 5,'label':"Гамаки"}],
              leftVars:[{'id': 3,'label':'123 Вазы', 'children':[{'id': 2,'label':"аквариумы"},{'id': 4,'label':"конусы"}]},{'id': 5,'label':"234 Гамаки"}],
              rightVars:[{'id': 11,'label':"4 кота"},{'id': 12,'label':"Безе"},{'id': 22,'label':'Lush'}],//[1,2,3,4,5],
              genParams:[
                {'name':'Материал', 'alias':'unit-materials', 'valid':true, 'type':''},
                {'name':'Цвет', 'alias':'unit-colors', 'valid':true, 'type':''},
                {'name':'Вес от, кг', 'alias':'min_weight', 'valid':true, 'type':'float'},
                {'name':'Вес до, кг', 'alias':'max_weight', 'valid':true, 'type':'float'},
                {'name':'Количество, шт', 'alias':'count', 'valid':true, 'type':'int'},
                {'name':'Залог, р', 'alias':'bail', 'valid':true, 'type':'float'},
              ],
              groupParams:[
                {'name':'Вид', 'alias':'day-cost', 'valid':true, 'type':'float'},
                {'name':'H, см', 'alias':'bail', 'valid':true, 'type':'float'},
              ],
              results:false,
              showParams: true,
              colorData:'',
              pickedColors:[],
              host:this.$store.state.host,
            }
      },
      methods:{
        search:function () {
          let vm = this;
          ax.get(this.host+'/units/get-all-units',{'params': {'offset': 0,'size': 4,'filter': '', 'last-group-id':-1}})
            .then(function(data){
                console.log(data.data );
                vm.results = data.data;
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
        addToBasket: function (id) {
          var vm = this;
          var fd = new FormData;

            fd.set('unit-id', id);
          ax.get("/shared/get-csrf-token")
            .then(function(data1){
                ax.post("/orders/add-to-basket", fd,{headers:{'X-CSRFToken':data1.data}})
                  .then(function(data){
                      console.log(data.data);
                    }
                  )
                  .catch(function(data){
                      if(data.response)
                        console.warn(data.response.data);
                      else
                        console.warn('no connection')
                    }
                  )
              }
            )
            .catch(function(data){
                vm.badResult();
                if(data.response)
                  console.warn(data.response.data);
                else
                  console.warn('no connection')

              }
            )
        },
        generateOrder: function () {
          var vm = this;
          if (! vm.results) {
            console.log('empty order!');
            return
          }
          var fd = new FormData;
          var units = [];
          for (let i in vm.results){
             units.push({'id':vm.results[i].id,'count':vm.results[i].count});
          }
          console.log(units);
          fd.set('units', JSON.stringify(units));
          fd.set('owner', vm.results[0].owner);
          fd.set('commentary', 'called "MOM"');
          fd.set('start-date', '2020.01.01');
          fd.set('stop-date', '2020.02.02');
          fd.set('bail', 3000);
          fd.set('cost', 4500);

          ax.get("/shared/get-csrf-token")
            .then(function(data1){
                ax.post("/orders/new-order", fd,{headers:{'X-CSRFToken':data1.data}})
                  .then(function(data){
                      console.log(data.data);
                    }
                  )
                  .catch(function(data){
                      if(data.response)
                        console.warn(data.response.data);
                      else
                        console.warn('no connection')
                    }
                  )
              }
            )
            .catch(function(data){
                vm.badResult();
                if(data.response)
                  console.warn(data.response.data);
                else
                  console.warn('no connection')

              }
            )
        },
      },
      created:function(){
        ax = this.$axios.create({  baseURL: this.host});
        this.search();
        let v = this;
        ax.get(this.host+'/units/color-picker-source')
          .then(function(data){
              //console.log(data.data);
              v.colorData = data.data;
              v.$forceUpdate();
            }
          )
          .catch(function (data) {
              console.warn(data.response.data);
            }
          );
      }
    }
</script>

<style lang="sass" scoped>
  $lgray: #f6f6f6
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  $myred: #CA1612
  .SearchSiteBody
    //background-color: yellow
    .midPanel
      display: inline-block
      width: 665px
      margin-left: 18px
      font-family: Tahoma, serif
      font-size: 14px
      .params
        background-color: $lgray
        box-shadow: $shadow
        height: 215px
        .hideBtn
          color: gray
          margin-left: 15px
          padding-top: 5px
          margin-bottom: 5px
        .picPanel
          width: 145px
          height: 145px
          background-color: gray
          display: inline-block
          vertical-align: top
          margin-left: 15px
        .groupPanel
          display: inline-block
          vertical-align: top
          margin-left: 5px
          .genParam
            margin-bottom: 8px
            .label
              width: 40px
              display: inline-block
            .text
              width: 135px
              display: inline-block
        .genPanel
          display: inline-block
          vertical-align: top
          margin-left: 15px
          .genParam
            margin-bottom: 8px
            .label
              width: 120px
              display: inline-block
            .text
              width: 145px
              display: inline-block
      .results
        //text-align: center
        margin-top: 15px
        margin-left: -15px
        .zeroResult
          margin-top: 70px
          font-size: 24px
        .searchCard
          display: inline-block
          background-color: $lgray
          color: gray
          height: 190px
          margin-left: 15px
          margin-bottom: 10px
          .cartBtn
            vertical-align: top
            margin: 5px 0 0 -30px
            cursor: pointer
          .idLabel
            color: red
            margin: -25px 0 15px 5px
          .photo
            height: 155px
            width: 155px
            box-shadow: $shadow
          .text
            margin-top: 5px
            margin-left: 12px
            text-align: left
        .fixbtn
          font-size: 20px
          cursor: pointer
    .leftPanel
      background-color: $lgray
      margin-left: 18px
    .rightPanel
      //background-color: $lgray
      margin-left: 15px
      //float: right
    .sidePanel
      vertical-align: top
</style>
