<template>
  <div v-if="shown">
    <div class="bg"></div>
    <div class="DecorAdd">
      <color-picker ref = "colorPicker" :colorData="colorData" @hideColorPicker="onHideColorPicker"></color-picker>
      <pick-bar ref="pickBar" :arr="matData" :len="matLen" :showLim="matShowLim" :pickLim="matPickLim" @done="updateMaterials"></pick-bar>
      <decor-add-fill :shown="showAddFill" @hideAddFill="showAddFill=false"></decor-add-fill>
      <div v-if="showValidAlert" class="validAlert">
        <div class="text">Корректно заполните все поля</div>
        <div class="btn" @click="showValidAlert=false"><span>OK</span></div>
      </div>
      <div class="PicPanel" :class="[isEdit ? 'disabled':'']">
        <div class="Pic" v-for="(pic, index) in pics"  :key="index">
          <img class="picImg" :src="pic ? pic : host+'/static/img/shared/no_img.png'" @click="$refs.input[index].click()"/>
          <input class='hidden' type="file" :ref="'input'" :file="pic" @change="updatePics($event,index)">
        </div>
      </div>
      <div class="alterPicPanel PicPanel" :class="['disabled']">
        <div class="Pic" v-for="(pic, index) in pics"  :key="index">
          <img class="picImg" :src="pic ? pic : host+'/static/img/shared/no_img.png'"/>
        </div>
      </div>
      <div class="RightPanel">
        <div class="TopPanel">
          <div class="GenParams">
            <div class="GenParam" v-for="(param) in genParams"  :key="param.id">
              <div class="ParamName">{{param.name}}<info-button v-if="param.info" class="paramInfo" :title="param.info"/></div>
              <div v-if="param.name==='Цвет'" :class="['bar', colorArr.length ? '' : 'border']" @click="$refs.colorPicker.show(colorArr)">
                <div class="color" v-for="c in colorArr"  :key="c.id" :style="'background-image: url('+c.texture+'); background-color: #'+c.rgb_hex+'; width: ' + (165-(colorArr.length+1)*0.8)/colorArr.length+'px;'"></div>
              </div>
              <div v-if="param.name==='Материал'" :class="['bar', 'border']" @click="$refs.pickBar.show(editParams['unit-materials'])">
                <span v-if="matStr">{{matStr}}</span>
                <!--<span v-else class="placeholder">до {{matPickLim}} материалов</span>-->
              </div>
              <input :tabindex="['Цвет','Материал'].includes(param.name) ? '-1' : 1" :class="[['Цвет','Материал'].includes(param.name) ? 'hidden' : '', param.valid ? '' : 'invalid']" v-model="addDict[param['alias']]" @change="validateChange($event, param);" @input="validateInput($event, param)"/>
            </div>
          </div>
          <span></span>
          <div class="GroupParams" v-if="groups">
            <div class="Label">Категория</div>
            <div v-if="!isEdit" class="Groups">
              <div class="Group" v-for="(group,i) in groups" :key="group.id" v-if="group&&groupOptions[groups[i]]">
                <!-- <label>{{group}}</label> -->
                <select :tabindex="3"  v-if="groupOptions[groups[i]].length" v-model="groups[i+1]" @change="pickGroup(i, groups[i+1])">
                  <option class="hidden" disabled></option>
                  <option v-for="g in groupOptions[groups[i]]" :key="g.id" :value="g.id">
                    {{g.name}}
                  </option>
                </select>
              </div>
            </div>
            <div v-else class="Groups edit">
              <input class="Group" v-for="group in JSON.parse(editParams['group-info'].groups)" :key="group.id" :value="group" disabled/>
            </div>
            <div v-if="isEdit" class="Params">
              <div class="Param" v-for="param in editParams['group-info'].params"  :key="param.id">
                <div class="ParamName">{{param.name}}<span v-if="param.dimension">, {{param.dimension}}</span></div>
                <input  :tabindex="3" :class="[(param.valid||!hasKey(param,'valid')) ? '' : 'invalid']" v-model="params[param.id]" @input="validateInput($event, param,'float'); $forceUpdate()" @change="validateChange($event, param,'float'); $forceUpdate()"/>
              </div>
            </div>
            <div v-if="!isEdit&&groupParams[groups[groups.length-1]]" class="Params">
                <div class="Param" v-for="param in groupParams[groups[groups.length-1]]['parameters']" :key="param.id">
                  <div class="ParamName">{{param.name}}<span v-if="param.dimension">, {{param.dimension}}</span></div>
                  <input :tabindex="3" :class="[(param.valid||!hasKey(param,'valid')) ? '' : 'invalid']" v-model="params[param.id]" @input="validateInput($event, param,'float'); $forceUpdate()" @change="validateChange($event, param,'float'); $forceUpdate()"/>
                </div>
            </div>
          </div>
          <img class="GroupImg" v-if="!isEdit&&groupParams[groups[groups.length-1]]" :src="groupParams[groups[groups.length-1]]['picture']"/>
          <img class="GroupImg" v-if="isEdit" :src="editParams['group-info']['group-image']"/>
        </div>
        <div class="BotPanel">
          <div class="btn" @click="showAddFill=true">Заполнить за меня</div>
          <div class="BotParam">
            <div class="ParamName">{{botParams[0].name}}<info-button v-if="botParams[0].info" class="paramInfo" :title="botParams[0].info"/></div>
            <input :tabindex="2" v-model="addDict[botParams[0]['alias']]" :class="[botParams[0].valid ? '' : 'invalid']" @change="validateChange($event, botParams[0]);" @input="validateInput($event, botParams[0])"/>
          </div>
          <div class="BotParam">
            <div class="ParamName">{{botParams[1].name}}</div>
            <textarea :tabindex="2" v-model="addDict[botParams[1]['alias']]" :class="[botParams[1].valid ? '' : 'invalid']" @change="validateChange($event, botParams[1]);" @input="validateInput($event, botParams[1])"></textarea>
          </div>
          <div class="BtnBar">
            <div class="btn" @click="addDict.published=true;go();">Опубликовать</div>
            <div class="btn" @click="addDict.published=false;go();">Добавить на склад</div>
            <div class="btn" @click="hideAddDecor()">Отменить</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import DecorAddFill from "./DecorAddFill";
    import ColorPicker from "./ColorPicker";
    var ax;
    import PickBar from "~/components/shared/PickBar";
    import InfoButton from "../shared/InfoButton";

    export default {
      name: "DecorAdd",
      components: {InfoButton, PickBar, ColorPicker, DecorAddFill},
        data: function () {
            return {
              shown: false,
              editParams: {},//все параметры редактируемого декора
              addDict:{'photo1':'','photo2':'','photo3':'','photo4':'','photo5':'', 'unit-materials':'[]','weight':'','bail':'','count':'',
                'title':'', 'sets':'[]','first-day-cost':'','rent-min-days':'','day-cost':'','unit-group':'','unit-colors':'[]','parameters':{}, 'keywords':'', 'description':'', 'published':false},
              pics:['','','','',''],
              groupOptions:{},
              genParams:[
                {'name':'Материал', 'alias':'unit-materials', 'valid':true, 'type':'', 'info': 'до 5 материалов'},
                {'name':'Цвет', 'alias':'unit-colors', 'valid':true, 'type':'', 'info': 'до 5 цветов'},
                {'name':'Вес, кг', 'alias':'weight', 'valid':true, 'type':'float'},
                {'name':'Количество, шт', 'alias':'count', 'valid':true, 'type':'int'},
                {'name':'Минимальный срок аренды, сут', 'alias':'rent-min-days', 'valid':true, 'type':'int'},
                {'name':'Стоимость для первого дня, р/сут', 'alias':'first-day-cost', 'valid':true, 'type':'float'},
                {'name':'Стоимость для последующих дней, р/сут', 'alias':'day-cost', 'valid':true, 'type':'float'},
                {'name':'Залог, р', 'alias':'bail', 'valid':true, 'type':'float'},
                {'name':'Название', 'alias':'title', 'valid':true, 'type':'text'},
                //{'name':'Коллекции', 'alias':'sets', 'valid':true, 'type':''},
              ],
              groups:['root',1,2],//['root'], //выбранная ветка
              params:{}, //индивидуальные параметры последней подгруппы
              groupParams:{}, //полный словарь загруженных индивидуальных параметров
              botParams:[{'name':'Ключевые слова', 'alias':'keywords', 'valid':true, 'type':'words', 'info': 'добавьте слова через пробел'},
                {'name':'Комментарий', 'alias':'description', 'valid':true, 'type':'text'}],
              showAddFill: false,
              showColorPicker: 0,
              host:this.$store.state.host,
              colorData:[], //все цвета
              colorArr:[], //выбранные цвета
              colorLim:5, //ограничение на количество цветов
              matData:[], //все цвета
              matLen:1, //кол-во символов, для начала всплывания вариантов
              matShowLim:6, //кол-во строк с вариантами
              matPickLim:5, // ограничение на кол-во материалов
              showValidAlert: false,
              alertMsg:'Default',
            }
        },
        computed:{
          isEdit:function(){
            console.log(this.editParams);
            if (this.editParams.id) return true;
            return false;
          },
          matStr:function () {
            let ansArr=[];
            //console.log(this.addDict['unit-materials']);
            let idArr=JSON.parse(this.addDict['unit-materials']);
            for (let i in idArr){
              let mat = this.matData.filter(m => m.id===idArr[i]);
              ansArr.push(mat[0].name);
            }
            let ans = ansArr.join(', ');
            if (ans.length>16) ans=ans.substring(0,16)+'...';
            return ans;
          }
        },
        methods:{
          show : function(params){
            this.shown=true;
            if (params){
              this.editParams = params;
              this.fillParams();
            }
            this.$emit('scrollDisable');
            document.body.className='scrollDisable';
            //console.log(this.addDict['unit-materials']);
          },
          fillParams: function(){
            for (let i=0; i<5; i++){
              this.pics[i]=this.editParams['photo'+(i+1)];
            }
            for (let i in this.editParams){
              //let key = i.replace(/[_]/g,'-');
              this.addDict[i] = this.editParams[i].toString();
              //console.log(key);
            }
            this.addDict['sets']='[]';
            this.addDict['unit-colors']=JSON.stringify(this.addDict['unit-colors']);
            this.onHideColorPicker(this.editParams['unit-colors']);

            let buf = [];
            for (let i in this.editParams['unit-materials']){
              buf.push(this.editParams['unit-materials'][i].id);
            }
            this.addDict['unit-materials'] = JSON.stringify(buf);
            for (let i in this.editParams['group-info'].params){
              this.params[this.editParams['group-info'].params[i].id]=this.editParams['group-info'].params[i].value;
            }

            //console.log(this.addDict['unit-materials']);
          },
          validateInput:function(e,param, type){
            //console.log(e);

            if (param.type==='text'){
              param.valid=true;
              return
            }

            let val = e.target.value;
            if (!type) type=param.type;
            if (type==='float') {
              val = val.replace(/,/g,'.');
              val = val.replace(',','.');
              /*e.target.value = val;
              this.$forceUpdate();*/
            }
            let Re = {'text':/^[0-9a-zёа-я,.:\-\s]+$/gi, 'int': /^[0-9]+$/g, 'float':/^[0-9]+\.?[0-9]*?$/g, 'words':/^[a-zёа-я\s]+$/gi};

            if (Re[type].exec(val)) param.valid=true;
            else param.valid=false;
            //console.log(param);
          },
          validateChange:function(e,param, type){
            //console.log('aw');
            if (param.type==='text'){
              param.valid=true;
              return
            }

            let val = e.target.value;
            if (!type) type=param.type;
            if (type==='float') {
              val = val.replace(/,/g,'.');
              //e.target.value = val;
            }
            let Re = {'text':/^[0-9a-zёа-я,.:\-\s]+$/gi, 'int': /^[0-9]+$/g, 'float':/^[0-9]+(\.?[0-9]+)?$/g, 'words':/^[a-zёа-я\s]+$/gi};
            if (Re[type].exec(val)) param.valid=true;
            else param.valid=false;
            if (type==='float') {
              this.addDict[param.alias] = val.replace(',','.');
            }
          },
          checkValid:function(){
            let arr = this.genParams.concat(this.botParams);
            //console.log(arr);
            for (let i in arr){
              if (!arr[i].valid){
                this.showValidAlert=true;
                return false;
              }
            }
            return true;
          },
          hasKey:function(dict, key){
            let ans = false;
            //console.log(dict);
            //console.log('!!!!!!!');
            if (key in dict) ans=true;
            return ans;
          },
          go:function(){
            if(this.checkValid()){
              if(this.isEdit) this.editDecorUnit();
              else this.addDecorUnit();
            }
          },
          addGroupOptions: function (gid) {
            let vm = this;
            if (vm.groupOptions[gid]) return;


            let h = '/units/get-groups?parentid='+gid.toString();
            if (gid ==='root') {h = '/units/get-groups';}
            //console.log(h);

            ax.get(h)
              .then(function(data){
                vm.groupOptions[gid] = data.data;
                if (data.data.length===0) vm.addGroupParam(gid);
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
            //console.log(this.groupOptions);
          },
          addGroupParam: function(gid){
            let vm = this;
            if (vm.groupParams[gid]) {
              this.updateParams();
              return;
            }


            let h = '/units/get-group-parameters?groupid='+gid.toString();
            //console.log(h);

            ax.get(h)
              .then(function(data){
                  let pd = JSON.parse(data.data.parameters);
                  vm.groupParams[gid] = {picture:data.data.picture, parameters:pd};
                  vm.updateParams();
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
            //console.log(this.groupParams);
          },
          pickGroup: function (n, gid) {
            //console.log(gid);
            //console.log(n);
            this.groups = this.groups.slice(0, n+1);
            //console.log(this.groups);
            this.groups[n+1] = gid;
            this.addGroupOptions(gid);
            //console.log(this.groups);

          },
          updateParams: function(){
            this.params = {};
            var ps = this.groupParams[this.groups[this.groups.length-1]]['parameters'];
            for (let p in ps){
              //console.log(ps[p].name);
              this.params[ps[p].id] = '';
            }
          },
          hideAddDecor:function(){
            //console.log('hide ti');
            //this.$emit('hide-add-decor');
            /*this.groups=['root'];
            this.colorArr=[];*/
            this.clear();
            this.shown=false;
            document.body.className='';
          },
          updatePics :function(event,n){
            //console.log(event);
            var input = event.target;
            var vm = this;
            /*vm.pics[n] = '';
            vm.addDict['photo'+(n+1)] = '';*/
            if (input.files && input.files[0]){
              //console.log(input.files);
              var reader = new FileReader();
              reader.onload = function (e) {
                vm.pics[n] = e.target.result;
                vm.addDict['photo'+(n+1)] = e.target.result;
                //console.log(n);
                vm.$forceUpdate();
              }
              reader.readAsDataURL(input.files[0]);

            }
          },
          editDecorUnit:function(){
            var vm = this;
            var fd = new FormData;
            vm.addDict['unit-group'] = vm.groups[vm.groups.length-1];
            //vm.addDict['parameters'] = vm.params;
            vm.addDict['parameters'] = JSON.stringify(vm.params);

            for ( var key in vm.addDict ) {
              fd.append(key, vm.addDict[key]);
            }
            console.log(fd);
            console.log(vm.addDict);
            ax.get("/shared/get-csrf-token")
              .then(function(data1){
                  ax.post("/units/update", fd,{headers:{'X-CSRFToken':data1.data,'Content-Type': 'multipart/form-data'}})
                    .then(function(data){
                        console.log(data.data);
                        vm.hideAddDecor();
                        window.location.reload();
                      }
                    )
                    .catch(function(data){
                        if(data.response){
                          console.warn(data.response.data);
                        }
                        else
                          console.warn('no connection')
                      }
                    )
                }
              )
              .catch(function(data){
                  if(data.response){
                    console.warn(data.response.data);
                  }
                  else
                    console.warn('no connection')
                }
              )
          },
          addDecorUnit:function(){
            var vm = this;
            var fd = new FormData;
            vm.addDict['unit-group'] = vm.groups[vm.groups.length-1];
            vm.addDict['parameters'] = JSON.stringify(vm.params);

            for ( var key in vm.addDict ) {
                fd.append(key, vm.addDict[key]);
            }

            fd.set('photo1', vm.$refs.input[0].files[0]);
            fd.set('photo2', vm.$refs.input[1].files[0]);
            fd.set('photo3', vm.$refs.input[2].files[0]);
            fd.set('photo4', vm.$refs.input[3].files[0]);
            fd.set('photo5', vm.$refs.input[4].files[0]);


            console.log(fd);
            console.log(vm.addDict);
            //console.log(vm.$refs.input)
            ax.get("/shared/get-csrf-token")
              .then(function(data1){
                  ax.post("/units/add-new-unit", fd,{headers:{'X-CSRFToken':data1.data,'Content-Type': 'multipart/form-data'}})
                  .then(function(data){
                      console.log(data.data);
                      vm.hideAddDecor();
                      window.location.reload();
                    }
                  )
                  .catch(function(data){
                      if(data.response){
                        console.warn(data.response.data);
                      }
                      else
                        console.warn('no connection')
                    }
                  )
              }
              )
              .catch(function(data){
                  if(data.response){
                    console.warn(data.response.data);
                  }
                  else
                    console.warn('no connection')
                }
              )

          },
          onHideColorPicker:function(colorArr){
            this.colorArr=colorArr;
            let arr =[];
            for (let c in colorArr){
              arr.push(colorArr[c].id);
            }

            this.addDict['unit-colors']=JSON.stringify(arr);
            this.showColorPicker=false;
            //this.$forceUpdate();
          },
          updateMaterials:function(idArr){
            this.addDict['unit-materials'] = JSON.stringify(idArr);
          },
          clear:function () {
            this.addDict={'photo1':'','photo2':'','photo3':'','photo4':'','photo5':'', 'unit-materials':'[]','weight':'','bail':'','count':'',
              'title':'', 'sets':'[]','first-day-cost':'','rent-min-days':'','day-cost':'','unit-group':'','unit-colors':'[]','parameters':{}, 'keywords':'', 'description':'', 'published':true};
            this.pics=['','','','',''];
            this.genParams=[
              {'name':'Материал', 'alias':'unit-materials', 'valid':true, 'type':'', 'info': 'до 5 материалов'},
              {'name':'Цвет', 'alias':'unit-colors', 'valid':true, 'type':'', 'info': 'до 5 цветов'},
              {'name':'Вес, кг', 'alias':'weight', 'valid':true, 'type':'float'},
              {'name':'Количество, шт', 'alias':'count', 'valid':true, 'type':'int'},
              {'name':'Минимальный срок аренды, сут', 'alias':'rent-min-days', 'valid':true, 'type':'int'},
              {'name':'Стоимость для первого дня, р/сут', 'alias':'first-day-cost', 'valid':true, 'type':'float'},
              {'name':'Стоимость для последующих дней, р/сут', 'alias':'day-cost', 'valid':true, 'type':'float'},
              {'name':'Залог, р', 'alias':'bail', 'valid':true, 'type':'float'},
              {'name':'Название', 'alias':'title', 'valid':true, 'type':'text'},
              //{'name':'Коллекции', 'alias':'sets', 'valid':true, 'type':''},
            ];
            this.groups=['root',1,2];
            this.params={};
            this.botParams=[
              {'name':'Ключевые слова', 'alias':'keywords', 'valid':true, 'type':'words', 'info': 'добавьте слова через пробел'},
              {'name':'Комментарий', 'alias':'description', 'valid':true, 'type':'text'}
              ];
            this.colorArr=[];
            this.editParams={};
          },
          test1:function (i) {
            this.$forceUpdate();
          },
          test2:function (i) {
            console.log(this.groupParams[56].toString());
          }

        },
        created: function () {
          let v = this;
          ax = this.$axios.create({  baseURL: this.host});
          //this.pickGroup(-1,'root');
          //this.groups.pop();
          this.addGroupOptions('root');
          this.addGroupOptions('1');
          this.addGroupOptions('2');
          //this.groups.push('root');
          //this.groupOptions.clear;
          ax.get(this.host+'/units/color-picker-source')
            .then(function(data){
                //console.log(data.data);
                v.colorData = data.data;
                v.$forceUpdate();
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
          ax.get(this.host+'/units/materials-source')
            .then(function(data){
                //console.log(data.data);
                v.matData = data.data;
                v.$forceUpdate();
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

        }



    }
</script>

<style lang="sass" scoped>
    $lgray: #f6f6f6
    $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
    $myred: #CA1612
    .bg
      background-color: darkgray
      opacity: 0.3
      position: fixed
      left: 0
      top: 0
      height: 100vh
      width: 100vw
      z-index: 0
    .DecorAdd
      position: fixed
      opacity: 1
      left: 145px
      top: 120px
      background-color: white
      width: 1085px
      text-align: left
      box-shadow: $shadow
      font-family: Tahoma, serif
      z-index: 1
      .btn
        display: inline-block
        text-align: center
      .DecorAddFill
        z-index: 2
      .ColorPicker
        z-index: 2
      .PickBar
        position: fixed
        z-index: 2
        left: 550px
        top: 140px
        width: 460px
        height: 40px
      .PicPanel
        display: inline-block
        margin: 28px 10px 0 15px
        .Pic
          display: inline-block
          .picImg
            cursor: pointer
            height: 40px
            width: 40px
            margin: 8px 8px 0 0
            vertical-align: top
          &:first-child
            display: block
            //margin: 0
            .picImg
              width: 186px
              height: 186px
              margin: 0
        button
          display: block
      .PicPanel.disabled
        pointer-events: none
      .alterPicPanel
        margin: 28px 10px 0 -207px
        position: absolute
        z-index: 2
      .validAlert
        position: absolute
        width: 628px
        height: 208px
        left: 215px
        top: 185px
        background: #FFFFFF
        border: 0.5px solid #C4C4C4
        box-sizing: border-box
        box-shadow: $shadow
        text-align: center
        .text
          font-size: 21px
          margin-top: 52px
        .btn
          width: 200px
          display: inline-block
          font-size: 18px
          margin-top: 64px
          padding: 10px 0 10px 0
      .RightPanel
        display: inline-block
        vertical-align: top
        font-size: 14px
        margin-top: 28px
        //margin-left:
        .paramInfo
          margin-left: 5px
          display: inline-block
        span
          vertical-align: top
        .TopPanel
          //background-color: aliceblue
          display: inline-block
          min-height: 200px
          //width: 900px
          .GenParams
            //text-align: right
            display: inline-block
            .bar
              vertical-align: middle
              width: 166px
              height: 24px
              display: inline-block
              cursor: pointer
              text-align: center
              //border-left: darkgray solid thin
              span
                display: inline-block
                padding-left: 7px
                width: inherit
                font-size: 14px
                vertical-align: middle
                text-align: left

              .color
                height: 24px
                display: inline-block
                background-size: cover
                border: lightgray solid thin
                border-left: none
                &:first-child
                  border-left: lightgray solid thin
              .placeholder
                color: gray
            .bar.border
              border: lightgray solid thin
              width: 165px

            .GenParam
              margin-bottom: 10px
              .ParamName
                width: 180px
                display: inline-block
              input
                width: 160px
                height: 22px
                font-size: 14px
                padding-left: 5px
          .GroupParams
            display: inline-block
            vertical-align: top
            margin-left: 45px
            margin-right: 23px
            .Label
              //margin: 0px 0px 0px 0px
              width: 90px
              display: inline-block

            .Groups
              //width: 230px
              display: inline-block
              vertical-align: top
              //margin-top: 10px
              .Group
                margin: 0px 0px 10px 0px
                select
                  height: 27px
                  width: 163px
                  font-size: 14px
                  padding-left: 5px
            .Groups.edit
                input
                  width: 155px
                  height: 22px
                  padding-left: 5px
                  font-size: 14px
                  display: block
            .Params
              margin-top: 30px
              .Param
                margin: 0 0 10px 0
                .ParamName
                  width: 90px
                  display: inline-block
                input
                  width: 155px
                  height: 22px
                  padding-left: 5px
                  font-size: 14px
          .GroupImg
            width: 145px
            height: 145px
            vertical-align: top
            display: inline-block
            border: solid lightgray thin
        .BotPanel
          .btn
            display: inline-block
            padding: 23px 0 23px 0
            font-size: 21px
            text-align: center
            position: absolute
            margin: 105px 0 0 -200px
            width: 357px
            z-index: 1
          .BotParam
            margin-bottom: 10px
            .ParamName
              vertical-align: top
              width: 180px
              display: inline-block
            input
              width: 648px
              height: 22px
              font-size: 14px
              padding-left: 5px
            textarea
              width: 646px
              padding-left: 5px
              height: 134px
              resize: none
              //padding: 1px
              font-size: 14px
          .BtnBar
            text-align: right
            margin: 30px 0px 30px 153px
            .btn
              width: 200px
              //height: 37px
              padding: 10px 0 10px 0
              margin: 0 0px 0 22px
              //margin: 15px 20px 20px 0
              font-size: 18px
              position: inherit


</style>
