<template>
    <div v-if="shown" class="DecorCard">
      <my-alert ref="alert" class="alert" :params="alertParams" @ok="deleteUnit" @close="$refs.alert.shown=false"></my-alert>
      <div class="PicPanel">
        <img class="BigImg" :src="params.photo1 ? params.photo1 : host+'/static/img/shared/no_img.png'"/>
        <div class="smallPanel">
          <img v-if="params.photo2" class="SmallImg" :src="params.photo2 ? params.photo2 : host+'/static/img/shared/no_img.png'"/>
          <img v-if="params.photo3" class="SmallImg" :src="params.photo3 ? params.photo3 : host+'/static/img/shared/no_img.png'"/>
          <img v-if="params.photo4" class="SmallImg" :src="params.photo4 ? params.photo4 : host+'/static/img/shared/no_img.png'"/>
          <img v-if="params.photo5" class="SmallImg" :src="params.photo5 ? params.photo5 : host+'/static/img/shared/no_img.png'"/>
        </div>

      </div>
      <div class="RightPanel">
        <div class="TopPanel">
          <div class="DecorName">{{params.title}}</div>
          <div class="col col1">
            <div class="line" v-for="p in params.parameters" :key="p.id">
              <div class="name">{{p.name}} = </div> <div class="val">{{p.value}} {{p.dimension}}</div>
            </div>
          </div>
          <div class="col col2">
            <div class="line">
              <div class="name">Материал: </div><div class="val text">{{mat}}</div>
            </div>
            <div class="line">
              <div class="name">Цвет: </div>
              <div class="val">
                <div class="colorBar">
                  <div class="color" v-for="c in params['unit-colors']" :key="c.id" :style="makeColorStyle(c)"></div>
                </div>
              </div>
            </div>
            <div class="line">
              <div class="name">Вес: </div> <div class="val">{{params.weight}} кг</div>
            </div>
            <div class="line count">
              <div class="name">Количество: </div> <div class="val">{{params.count}} шт</div>
            </div>
          </div>
          <div class="col col3">
            <div class="line">
              <div class="name">Первый день: </div> <div class="val">{{params['first-day-cost']}} р/сут</div>
            </div>
            <div class="line">
              <div class="name">Аренда от: </div> <div class="val">{{params['rent-min-days']}} сут</div>
            </div>
            <div class="line">
              <div class="name">Аренда: </div> <div class="val">{{params['day-cost']}} р/сут</div>
            </div>
            <div class="line">
              <div class="name">Залог: </div> <div class="val">{{params.bail}} р</div>
            </div>
          </div>
        </div>
        <div class="Btns">
          <div class="status">Заказов нет</div>
          <div class="btn" @click="$emit('edit-decor', params)">Редактировать</div>
          <div v-if="posted" class="btn" @click="unpublish">Отменить публикацию</div>
          <div v-else class="btn" @click="publish">Опубликовать</div>
          <div class="btn" @click="$refs.alert.shown=true">Удалить</div>
        </div>
        <div class="BotPanel">
          <div class="line hidden">
            <div class="name">Коллекция: </div> <div class="val">{{params.sets}}</div>
          </div>
          <div class="line">
            <div class="name">Ключевые слова: </div>
            <div class="val">
              <div v-for="w in params['keywords-info']" :key="w.id" class="kw">#{{w.word}}</div>
            </div>

          </div>
          <div class="line" v-if="params.description">
            <div class="name">Комментарий: </div> <div class="val">{{params.description}}</div>
          </div>
        </div>
      </div>


    </div>
</template>

<script>
    import BtnBar from "~/components/shared/BtnBar";
    import MyAlert from "../shared/MyAlert";
    var ax;

    export default {
        name: "DecorCard",
        components: {MyAlert, BtnBar},
        props: ["params"],
          data: function () {
              return {
                posted: this.params['published'],
                host:this.$store.state.host,
                shown:true,
                alertParams:{
                  text:'Вы уверены, что хотите удалить этот товар?',
                  btns:[{name:'ok', text:'Удалить'},{name:'close', text:'Отмена'}]
                },
              }
          },
        computed:{
          materialArr:function () {
            let arr = [];
            for (let m in this.params['unit-materials']){
              arr.push(this.params['unit-materials'][m].name);
            }
            return arr;
          },
          mat:function () {
            let ans = this.materialArr.join(', ');
            if (ans.length>6)ans=ans.substring(0,5)+'...';
            return ans;
          }
        },
      methods:{
        hideAlert:function (i) {
          console.log(i);
          this.$refs.alert.hide();
        },
        publish:function () {
          var vm = this;
          ax.get("/shared/get-csrf-token")
            .then(function (data1) {
                console.log(data1.data);
                let fd = new FormData;
                fd.append('csrfmiddlewaretoken', data1.data);
                fd.append('id', vm.params.id)
                ax.post("/units/publish", fd, {
                  headers: {
                    'X-CSRFToken': data1.data,
                    'Content-Type': 'multipart/form-data'
                  }
                })
                .then(function (data) {
                    vm.posted = !vm.posted;
                    console.log(data.data);
                  }
                )
                .catch(function (data) {
                    if(data.response){
                      console.warn(data.response.data);
                    }
                    else
                      console.warn('no connection')
                  }
                )
              }
            )
            .catch(function (data) {
                console.warn(data);
              }
            )
        },
        unpublish:function () {
          var vm = this;
          ax.get("/shared/get-csrf-token")
            .then(function (data1) {
                console.log(data1.data);
                let fd = new FormData;
                fd.append('csrfmiddlewaretoken', data1.data);
                fd.append('id', vm.params.id)
                ax.post("/units/unpublish", fd, {
                  headers: {
                    'X-CSRFToken': data1.data,
                    'Content-Type': 'multipart/form-data'
                  }
                })
                  .then(function (data) {
                      vm.posted = !vm.posted;
                      console.log(data.data);
                    }
                  )
                  .catch(function (data) {
                      if(data.response){
                        console.warn(data.response.data);
                      }
                      else
                        console.warn('no connection')
                    }
                  )
              }
            )
            .catch(function (data) {
                console.warn(data);
              }
            )
        },
        deleteUnit:function () {
          var vm = this;
          ax.get("/shared/get-csrf-token")
            .then(function (data1) {
                console.log(data1.data);
                let fd = new FormData;
                fd.append('csrfmiddlewaretoken', data1.data);
                fd.append('id', vm.params.id)
                ax.post("/units/delete-unit", fd, {
                  headers: {
                    'X-CSRFToken': data1.data,
                    'Content-Type': 'multipart/form-data'
                  }
                })
                .then(function (data) {
                    //vm.shown = false;
                    vm.$emit('delete');
                    console.log(data.data);
                  }
                )
                .catch(function (data) {
                    if(data.response){
                      console.warn(data.response.data);
                    }
                    else
                      console.warn('no connection')
                  }
                )
              }
            )
            .catch(function (data) {
                console.warn(data);
              }
            )
        },
        makeColorStyle:function (color) {
          let ans = ' width: ' + 53/this.params['unit-colors'].length+'px;';
          if (color.texture) ans+=('background-image: url('+color.texture+');');
          if (color.rgb_hex) ans+=('background-color: #'+color.rgb_hex+';');
          return ans;
        }
      },
      created:function () {
        ax = this.$axios.create({  baseURL: this.host});
      }
    }
</script>

<style lang="sass" scoped>
  $lgray: #f6f6f6
  $myblue: #182b93
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  .DecorCard
    background-color: $lgray
    //border: solid  1px
    box-shadow: $shadow
    width: 847px
    margin-bottom: 20px
    .alert
      margin: 40px 0 0 150px
      position: absolute
    .line
      .name
        display: inline-block
        vertical-align: top
        margin-bottom: 10px
        margin-right: 5px
      .val
        display: inline-block
        vertical-align: top
        margin-bottom: 10px

      .text
        display: inline-block
        margin-right: 5px
      .colorBar
        vertical-align: top
        display: inline-block
        //height: 10px
        .color
          height: 10px
          display: inline-block
          background-size: cover
        img
          height: 10px
          width: 53px

    .PicPanel
      margin: 9px 0 0 11px
      display: inline-block
      .BigImg
        width: 186px
        height: 186px
        margin: 0
        padding: 0
      .smallPanel
        height: 40px
        margin: 0
        padding: 0
        .SmallImg
          height: 40px
          width:  40px
          display: inline
          margin-top: 4px
          margin-right: 4px
    .RightPanel
      display: inline-block
      vertical-align: top
      width: 630px
      margin-left: 13px
      .TopPanel
        //background-color: aliceblue
        display: inline-block
        min-height: 200px
        .DecorName
          font-size: 24px
          //font-weight: bold
          margin-top: 10px
          //margin: 10px
        .col
          margin-top: 30px
          margin-right: 13px
          display: inline-block
          vertical-align: top
          font-size: 15.5px
          overflow-y: auto
        .col1
          //margin: 30px -5px 0 0
          max-width: 82px
        .col2
          //margin: 30px 10px 0 20px
          max-width: 135px
        .col3
          //margin: 30px 10px 0 20px
          max-width: 215px
      .BotPanel
        margin-bottom: 20px
        .line
          max-width: 615px
          .val
            max-width: 480px
            margin-bottom: 0
          .kw
            margin-right: 10px
            cursor: pointer
            display: inline-block
            margin-bottom: 10px
            &:hover
              color: $myblue
      .Btns
        float: right
        margin-top: 10px
        margin-right: 15px
        .btn
          display: block
          border: solid lightgrey 1px
          padding: 10px 0px 10px 0px
          margin-bottom: 10px
          text-align: center
          width: 171px
        .status
          text-align: right
          margin-bottom: 20px
          color: black
          box-shadow: none
  .min.DecorCard
    //background-color: lightskyblue
    //padding: 5px
    width: fit-content
    //text-align: center
    box-shadow: none
    display: inline-block
    margin-right: 10px
    .PicPanel
      display: block
      margin: 0
      .BigImg
        box-shadow: $shadow
      .smallPanel
        display: none
    .RightPanel
      display: block
      width: inherit
      .TopPanel
        //display: block
        min-height: fit-content
        text-align: left
        width: inherit
        .DecorName
          font-size: 18px
          font-weight: normal
          margin: 0px
          display: none
        .col
          margin: 0
        .col1
          margin: 0
        .line
          display: none
        .line.count
          display: inline-block
          .name
            display: none
          .val
            margin: 0
            padding: 5px
      .Btns
        display: none
      .BotPanel
        display: none

</style>
