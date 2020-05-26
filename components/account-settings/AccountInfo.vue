<template>
    <div class="AccountInfo">
      <div class="waiter" v-if="waiting">
        <img class="waitImg" :src="waitImg"/>
      </div>
      <div class="addAvatar  block">
        <avatar-picker ref="ap" :startImg="avatars.big" @pickAvatar="makeAvatars"></avatar-picker>
        <div class="label1">Добавление аватара</div>
        <img :src="avatars.big" class="big"/>
        <img :src="avatars.small" class="small"/>
        <img :src="host+'/static/img/shared/grayRing.png'" class="smallRing"/>
        <div class="warning"><span >{{errMsg.img}}</span></div>
        <div class="btn" @click="$refs.ap.$refs.img.click();">Выбрать файл</div>
      </div>

      <form class="changePswd block">
        <div class="label1">Смена пароля</div>
        <div class="line">
          <div class="label">Новый пароль</div>
          <input :type="showPswd[0] ? 'text' : 'password'" class="text pswd" v-model="passwords[0]" />
          <img :src="showPswd[0] ? host+'/static/img/shared/eye_on.png' : host+'/static/img/shared/eye_off.png'" class="eye" @click="showPswd[0]=!showPswd[0]; $forceUpdate();"/>
        </div>
        <div class="line">
          <div class="label">Пароль еще раз</div>
          <input :type="showPswd[1] ? 'text' : 'password'" class="text pswd" v-model="passwords[1]" />
          <img :src="showPswd[1] ? host+'/static/img/shared/eye_on.png' : host+'/static/img/shared/eye_off.png'" class="eye" @click="showPswd[1]=!showPswd[1]; $forceUpdate();"/>
        </div>
        <div class="warning"><span >{{errMsg.pswd}}</span></div>
        <div class="btn" @click="savePassword">Сменить пароль</div>
      </form>

      <div class="alterInfo block">
        <div class="label1">Доп. информация</div>
        <div v-for="i in infoKeys" :key=i.id class="line">
          <div class="label">{{i.label}}</div>
          <textarea v-if="i.label==='О компании'" v-model="alterInfo[i.key]"></textarea>
          <input v-else class="text" v-model="alterInfo[i.key]"/>
        </div>
        <div class="warning"><span >{{errMsg.info}}</span></div>
        <div class="btn" @click="saveInfo">Сохранить</div>
      </div>

      <div class="rent block">
        <div class="label1">Условия аренды</div>
        <div class="line">
          <div class="label">Способ доставки</div>
          <div class="delivery">
            <div v-for="i in rentInfo.delivery" :key=i.id class="line">
              <div class="label">{{i.name}}</div>
              <input placeholder="Стоимость" class="text"  v-model="i.cost"/>
              <div src="" class="rBtn "><img class="minus" :src="host+'/static/img/shared/r_minus.png'"/></div>
            </div>
            <div src="" class="rBtn "><img class="plus" :src="host+'/static/img/shared/r_plus.png'"/></div>
          </div>
        </div>
        <div class="line">
          <div class="label">Адрес склада</div>
          <input class="text" v-model="rentInfo.address"/>
        </div>
        <div class="line">
          <div class="label">Ближайшее метро</div>
          <input class="text" v-model="rentInfo.metro"/>
        </div>
        <div class="line">
          <div class="label">Комментарий</div>
          <textarea  v-model="rentInfo.description"></textarea>
        </div>
        <div class="warning"><span >{{errMsg.rent}}</span></div>
        <div class="btn" @click="saveRent">Сохранить</div>
      </div>

      <div class="workTime block">
        <div class="label1">Время работы</div>
        <div v-for="i in days" :key=i.id class="line">
          <div class="label">{{i.name}}</div>
          <div class="midTime" >
            <div v-if="!workTime[i.key]['rest']">
              <span>с</span>
              <div class="time">
                <input class="text" v-model="workTime[i.key]['start-h']"/>
                <input class="text" v-model="workTime[i.key]['start-m']"/>
                <div class="dots">:</div>
              </div>
              <span>до</span>
              <div class="time">
                <input class="text" v-model="workTime[i.key]['fin-h']"/>
                <input class="text" v-model="workTime[i.key]['fin-m']"/>
                <div class="dots">:</div>
              </div>
            </div>
          </div>
          <input type="checkbox" class="cb" v-model="workTime[i.key]['rest']"/>
          <span>выходной</span>
        </div>
        <div class="warning"><span >{{errMsg.workTime}}</span></div>
        <div class="btn" @click="saveTime">Сохранить</div>
      </div>

      <div class="notifications block">
        <div class="label1">Оповещения</div>
        <div v-for="i in noteKeys" :key=i.id class="line">
          <input type="checkbox" v-model="noteVals[i.key]"/>
          <div class="label">{{i.text}}</div>
        </div>
        <div class="warning"><span >{{errMsg.note}}</span></div>
        <div class="btn" @click="saveNote">Сохранить</div>
      </div>
    </div>
</template>

<script>
    import AvatarPicker from "./AvatarPicker";
    var ax;
    export default {
        name: "AccountInfo",
      components: {AvatarPicker},
      data: function () {
            return {
              waiting: false,
              passwords:['',''],
              avatars:{'big':'','small':''},
              newAvatar:'',
              showPswd:[false,false],
              infoKeys: [{key:"name",label:'Название компании'},{key:"site",label:'Сайт'},{key:"city",label:'Город'},{key:"mail",label:'Почта'},{key:"phone",label:'Телефон'},{key:"phone2",label:'Доп. телефон'},{key:"description",label:'О компании'}],
              days:[{name:'понедельник', key:'mon'},{name:'вторник', key:'tue'},{name:'среда', key:'wed'},{name:'четверг', key:'thu'},{name:'пятница', key:'fri'},{name:'суббота', key:'sat'},{name:'воскресенье', key:'sun'},],
              noteKeys: [ {text:'Показывать мгновенные сообщения', key:'push'}, {text:'Включить звуковое оповещение', key:'sound'}, {text:'Присылать смс о моем заказе', key:'orderSms'}, {text:'Присылать смс об окончании и начале срока аренды', key:'timeSms'},{text:'Присылать сообщение о новом заказе на эл. почту', key:'orderMail'},{text:'Присылать сообщения об окончании и начале срока аренды на эл. почту', key:'timeMail'}],
              alterInfo:{},
              workTime: {"mon": {"rest": true, "start-h": 0, "start-m": 0, "fin-h": 21, "fin-m": 0}, "tue": {"rest": true, "start-h": 0, "start-m": 0, "fin-h": 21, "fin-m": 0}, "wed": {"rest": true, "start-h": 0, "start-m": 0, "fin-h": 21, "fin-m": 0}, "thu": {"rest": true, "start-h": 0, "start-m": 0, "fin-h": 21, "fin-m": 0}, "fri": {"rest": true, "start-h": 0, "start-m": 0, "fin-h": 21, "fin-m": 0}, "sat": {"rest": true, "start-h": 9, "start-m": 0, "fin-h": 21, "fin-m": 0}, "sun": {"rest": true, "start-h": 9, "start-m": 0, "fin-h": 21, "fin-m": 0}},
              noteVals:{},
              rentInfo:{},
              host:this.$store.state.host,
              settings: false,
              waitImg:'',
              errMsg:{'img':'','pswd':'','info':'','rent':'','workTime':'','note':''},
            }
        },
        methods:{
          translateErr:function(text){
            let ans = 'Неизвестная ошибка на сервере';
            let errDict = {
              'you must be logged in':'Этот ресурс доступен только зарегистрированым пользователям',
              'please use POST method':'Ошибка на сервере',
              'please use POST request, not':'Ошибка на сервере',
              'there is no parameter':'Ошибка на сервере',
              'login failed':'Неверный логин и/или пароль',
              'password must be at last 4 chars':'Пароль должен быть не менее 4 символов',
              'password not specified':'Пароль не задан',
              'login already exists':'Такой пользователь уже существует',
              'there is no <avatar71> and <avatar170> in FILES':'Выберите изображение для аватара',
              'not valid telephone number:':'Номер телефона указан в недопустимом формате. Укажите номер в формате 8xxx-xxx-xx-xx',
              'There is no specified city in base':'Наш сайт не доступен для указанного города',
              'wrong value:':'Ошибка на сервере: переданы данные в недопустимом формате',
              'hour must be 0 to 23':'Поле "час" имеет некорректное значение',
              'minutes must be 0 to 59':'Поле "минуты" имеет некорректное значение',
              'value must be <true> or <false>':'Некорректное значение переменной',
              'Wrong data structure':'Ошибка на сервере',
              'Wrong data structure (value)':'Ошибка на сервере',
              'Wrong syntax (value)':'Ошибка на сервере',
              'Method not implemented yet':'Функция не реализована на сервере',
              'Wrong syntax (json decode error)':'Ошибка на сервере',
              'delivery parameter must be valid json array':'Ошибка на сервере'
            };
            let keys = Object.keys(errDict);
            keys.forEach(function(key, i, keys){
              let Re = new RegExp("^"+key+".*","gi");
              if (Re.exec(text)) {
                ans=errDict[key];
              }

              //console.log(key);
            });
            return ans;
          },
          getSettings: function(func){
           ax.get(this.host+'/account/get-settings')
              .then(function(data){
                // console.log(data.data );
                func(data.data);
                return (data.data);
              })
              .catch(function (data) {
                if(data)
                  console.warn(data);
                else
                  console.warn('no connection');
                return false;
                }
              );
          },
          loadSettings: function () {
            let vm = this;
            vm.getSettings(
              function (ans) {
                // console.log(ans);
                vm.settings = ans;
                vm.alterInfo = ans.company.info;
                vm.workTime = ans.company.workTime;
                vm.noteVals = ans.user.notification;
                vm.rentInfo = ans.company.rent;
                vm.avatars['big'] = ans.avatar.big;
                vm.avatars['small'] = ans.avatar.small;
                vm.$forceUpdate();
              }
            );
          },
          saveNote: function () {
            let vm = this,
              fd = new FormData;

            vm.startWaiting();

            for ( let key in vm.noteVals ) {
              fd.set(key, vm.noteVals[key]);
            }
            console.log(fd);
            ax.get("/shared/get-csrf-token")
              .then(function(data1){
                  ax.post("/account/save-notification", fd,{headers:{'X-CSRFToken':data1.data}})
                    .then(function(data){
                        // console.log(data.data);
                        vm.goodResult();
                      }
                    )
                    .catch(function(data){
                        vm.badResult();
                      if(data.response){
                        console.warn(data.response.data);
                        vm.errMsg.note = vm.translateErr(data.response.data);
                      }
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
          saveTime: function () {
            var vm = this;
            var fd = new FormData;

            vm.startWaiting();

            for ( let key in vm.workTime ) {
              fd.set(key, JSON.stringify(vm.workTime[key]));
            }
            console.log(fd);
            ax.get("/shared/get-csrf-token")
              .then(function(data1){
                  ax.post("/account/save-work-time", fd,{headers:{'X-CSRFToken':data1.data}})
                    .then(function(data){
                        console.log(data.data);
                        vm.goodResult();
                      }
                    )
                    .catch(function(data){
                        vm.badResult();
                      if(data.response){
                        console.warn(data.response.data);
                        vm.errMsg.workTime = vm.translateErr(data.response.data);
                      }
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
          saveInfo: function () {
            var vm = this;
            var fd = new FormData;
            vm.startWaiting();

            for ( let key in vm.alterInfo ) {
              fd.set(key, vm.alterInfo[key]);
              console.log(vm.alterInfo['description']);
            }
            console.log(fd);
            ax.get("/shared/get-csrf-token")
              .then(function(data1){
                  ax.post("/account/save-info", fd,{headers:{'X-CSRFToken':data1.data}})
                    .then(function(data){
                        console.log(data.data);
                        vm.goodResult();
                      }
                    )
                    .catch(function(data){
                        vm.badResult();
                      if(data.response){
                        console.warn(data.response.data);
                        vm.errMsg.info = vm.translateErr(data.response.data);
                      }
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

                })
          },
          saveRent: function () {
            var vm = this;
            var fd = new FormData;
            vm.startWaiting();

            for ( let key in vm.rentInfo ) {
              if (key==='delivery') fd.set(key, JSON.stringify(vm.rentInfo[key]));
              else fd.set(key, vm.rentInfo[key]);
              /*console.log(key);
              console.log(vm.rentInfo[key]);*/
            }
            console.log(fd);
            ax.get("/shared/get-csrf-token")
              .then(function(data1){
                  ax.post("/account/save-rent", fd,{headers:{'X-CSRFToken':data1.data}})
                    .then(function(data){
                      console.log(data.data);
                      vm.goodResult();
                      }
                    )
                    .catch(function(data){
                      vm.badResult();
                      if(data.response){
                        console.warn(data.response.data);
                        vm.errMsg.rent = vm.translateErr(data.response.data);
                      }
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
          savePassword: function () {
            var vm = this;
            var fd = new FormData;
            vm.errMsg.pswd ='';
            if (vm.passwords[0]!=vm.passwords[1]) {
              vm.errMsg.pswd = 'Пароли не совпадают';
              return;
            }
            vm.startWaiting();
            fd.set('password',vm.passwords[0])
            ax.get("/shared/get-csrf-token")
              .then(function(data1){
                  ax.post("/account/password-set", fd,{headers:{'X-CSRFToken':data1.data}})
                    .then(function(data){
                      vm.goodResult();
                      console.log(data.data);
                      }
                    )
                    .catch(function(data){
                      vm.badResult();
                      if(data.response) {
                        console.warn(data.response.data);
                        vm.errMsg.pswd = vm.translateErr(data.response.data);
                      }
                      else{
                        console.warn('no connection')
                        vm.errMsg.pswd = 'Не удалось сохранить изменения из-за проблем со связью';
                      }
                    })
                }
              )
              .catch(function(data){
                vm.badResult();
                if(data.response)
                  console.warn(data.response.data);
                else{
                  console.warn('no connection')
                  vm.errMsg.pswd = 'Не удалось сохранить изменения из-за проблем со связью';
                }
              })
          },
          makeAvatars:function(data){
            let vm= this;
            vm.newAvatar = data;
            const smallsize=71;
            const bigsize=170;
            const img = new Image();

            img.src = data;
            img.onload = () => {

              const elem = document.createElement('canvas');
              const ctx = elem.getContext('2d');
              elem.height = smallsize;
              elem.width = smallsize;
              ctx.drawImage(img, 0, 0, smallsize, smallsize);
              ctx.canvas.toBlob((blob) => {
                let xf = new File([blob], 'avatar71', {type: 'image/png', lastModified: Date.now()});
                vm.avatars[0] = xf;
                elem.height = bigsize;
                elem.width = bigsize;
                ctx.drawImage(img, 0, 0, bigsize, bigsize);
                ctx.canvas.toBlob((blob) => {
                  let xf = new File([blob], 'avatar170', {type: 'image/png', lastModified: Date.now()});
                  vm.avatars[1] = xf;
                  vm.saveAvatar();
                }, 'image/png', 1);

              }, 'image/png', 1);



            }

            //console.log('end');
          },
          saveAvatar: function () {
            var vm = this;
            var fd = new FormData;


            vm.startWaiting();

            fd.set('avatar170', vm.avatars[1]);
            fd.set('avatar71', vm.avatars[0]);

            ax.get("/shared/get-csrf-token")
              .then(function(data1){
                  ax.post("/account/save-avatar", fd,{headers:{'X-CSRFToken':data1.data,'Content-Type': 'multipart/form-data'}})
                    .then(function(data){
                      console.log(data.data);
                      vm.goodResult();
                      vm.avatars['big']=vm.newAvatar
                      vm.avatars['small']=vm.newAvatar
                      vm.$refs.ap.hidePicker();
                      }
                    )
                    .catch(function(data){
                        vm.badResult();
                        if(data.response) {
                          console.warn(data.response.data);
                          vm.errMsg.img = vm.translateErr(data.response.data);
                        }
                        else
                          console.warn('no connection');
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
          startWaiting: function(){
            this.waitImg = this.host + '/static/img/shared/spinner.gif';
            this.waiting = true;
          },
          goodResult: function () {
            let vm = this;
            this.waitImg = this.host + '/static/img/shared/r_plus.png';
            window.setTimeout(function() {vm.waiting = false; console.log('good');}, 1000);


          },
          badResult: function () {
            let vm = this;
            this.waitImg = this.host + '/static/img/shared/r_minus.png';
            window.setTimeout(function() {vm.waiting = false; console.log('bad');}, 1000);
          },
        },


        created:function () {
          ax = this.$axios.create({  baseURL: this.host});
          this.loadSettings();
        }
    }
</script>

<style lang="sass" scoped>
  $lgray: #f6f6f6
  $myblue: #182b93
  $myred: #CA1612
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  .AccountInfo
    background-color: $lgray
    box-shadow: $shadow
    margin-right: 20px
    margin-bottom: 20px
    padding-bottom: 35px
    .waiter
      position: fixed
      top: 0
      left: 0
      background-color: white
      opacity: 0.5
      height: 100vh
      width: 100vw
      .waitImg
        text-align: center
        display: block
        //margin: auto
        margin-left: calc(50vw - 16px + 132px)
        margin-top: calc(50vh - 16px)
        vertical-align: middle
        width: 32px
    .block
      margin-top: 30px
      display: inline-block
      width: 100%
      font-size: 15.5px
      font-family: Tahoma, serif
      .btn
        text-align: center
        display: block
        padding: 8px 5px 8px 10px
        width: 150px
        margin-left: 345px
        //margin-top: 35px
      .line
        margin-bottom: 15px
        .label
          display: inline-block
          width: 400px
          margin-right: 20px
          text-align: right
          vertical-align: top
        input
          padding-left: 10px
          padding-right: 10px
          width: 145px
          height: 20px
          vertical-align: top
        textarea
          padding-left: 10px
          padding-right: 10px
          height: 80px
          width: 380px
          resize: none
        .pswd
          width: 130px
          padding-right: 25px
        .eye
          margin-left: -32px
          //width: 15px
          cursor: pointer
      .label1
        font-size: 21px
        margin-left: 50px
        margin-bottom: 20px
      .warning
        margin-top: -15px
        text-align: center
        //padding: 8px
        height: 30px
        display: block
        color: $myred
        span
          margin-top: 23px
          display: block
    .addAvatar
      .big
        display: inline-block
        height: 170px
        width: 170px
        margin-left: 345px
        border-radius: 95px
        overflow: hidden
        box-sizing: border-box
      .small
        display: inline-block
        vertical-align: top
        height: 71px
        width: 71px
        margin-left: 15px
      .smallRing
        margin-left: -76px
        width: 71px
        height: 71px
        display: inline-block
        vertical-align: top
    .rent
      .line

        input
          width: 380px
        .delivery
          display: inline-block
          width: 410px

          .line
            display: inline-block
            margin-top: 10px
            margin-bottom: 0

            &:first-child
              margin-top: 0
          .label
            width: 180px
            text-align: left
            margin-right: 10px
          input
            width: 125px
            //padding-left: 15px
            vertical-align: top
          .rBtn
            width: 27px
            height: 27px
            display: inline-block
            cursor: pointer
          .minus
            height: 27px
          .plus
            height: 27px
    .workTime
      .line
        .label
          width: 340px
          margin-right: 55px
        span
          vertical-align: top
        .midTime
          display: inline-block
          width: 263px
        .time
          margin-right: 15px
          margin-left: 15px
          background-color: white
          border: lightgray thin solid
          height: 24px
          display: inline-block
          padding-left: 5px
          width: 70px

          //span
            margin-right: -15px
          .text
            margin: 1px
            width: 28px
            text-align: center
            //background-color: orangered
          .dots
            display: inline-block
            margin-left: -40px
        input
          vertical-align: top
          width: 20px
          border: none
          outline: none
          padding: 0 0 0 0
          text-align: right
        .cb
          margin-left: 25px
          margin-right: 15px
          width: 27px
    .notifications
      .line
        input
          width: 27px
          margin-left: 250px
          padding: 0 0 0 0
        .label
          margin-left: 30px
          text-align: left






</style>
