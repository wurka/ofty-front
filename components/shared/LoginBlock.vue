<template>
    <div class="LoginBlock" v-if="shown">
      <div class="switch" @click="guest=!guest">
        <span v-if="guest">Войти</span>
        <span v-else>Зарегистрироваться</span>
      </div>
      <div class="content">
        <div class="warning"><div class="redtext">{{warning}}</div></div>


        <div class="contentForm" v-if="contentType==='common'">
          <div class="line">
            <div class="label">Почта</div>
            <input v-model="mail.value" />
          </div>
          <div class="line">
            <div class="label">Пароль</div>
            <input type="password" v-model="password.value" @keyup.enter="login()"/>
          </div>
          <div :class="['btns']">
            <div class="remind" @click="sendNewPswd=!sendNewPswd">Забыли пароль?</div>
            <div class="btn" @click="hide()">Отмена</div>
            <div class="btn" @click="login()">Войти</div>
          </div>
        </div>


        <div class="contentForm" v-if="contentType==='register'">
          <div class="line">
            <div class="label">Почта</div>
            <input v-model="mail.value" />
          </div>
          <div class="line">
            <div class="label">Пароль</div>
            <input type="password" v-model="password.value"/>
          </div>
          <div class="line">
            <div class="label">Пароль еще раз</div>
            <input type="password" v-model="rePassword.value"/>
          </div>
          <div class="line">
            <div class="label">Имя пользователя <img :src="host+'/static/img/shared/info.png'" title="Имя будет отображаться везде и от этого не избавиться"/> </div>
            <input v-model="username.value" />
          </div>
          <div class="captcha">
            <img :src="host+'/static/img/shared/uriy.svg'"/>
            <input v-model="capt" placeholder="код с картинки"/>
          </div>
          <div :class="['btns', 'reg']">
            <div class="btn" @click="hide()">Отмена</div>
            <div class="btn" @click="register()">Войти</div>
          </div>
        </div>


        <div class="contentForm" v-if="contentType==='remind'">
          <div v-if="codeStatus!='confirmed'" class="line">
            <div class="label">Почта</div>
            <input v-model="mail.value" />
          </div>
          <div :class="['btns']">
            <div v-if="!codeStatus" class="btn small" @click="refreshForm">Отмена</div>
            <div v-if="!codeStatus" class="btn mid" @click="codeStatus='asked'">Получить проверочный код</div>
            <div v-if="codeStatus==='asked'" class="btn big" @click="codeStatus='asked'">Получить проверочный код еще раз</div>
          </div>
          <div v-if="codeStatus==='asked'">
            <div class="line">
              <div class="label">Проверочный код</div>
              <input v-model="code" />
            </div>
            <div :class="['btns', 'reg']">
              <div class="btn " @click="refreshForm">Отмена</div>
              <div class="btn " @click="codeStatus='confirmed'">Проверить код</div>
            </div>
          </div>
          <div v-if="codeStatus==='confirmed'">
            <div class="line">
              <div class="label">Новый пароль</div>
              <input type="password" v-model="password.value"/>
            </div>
            <div class="line">
              <div class="label">Пароль еще раз</div>
              <input type="password" v-model="rePassword.value"/>
            </div>
            <div :class="['btns', 'reg']">
              <div class="btn " @click="refreshForm">Отмена</div>
              <div class="btn " @click="register">Войти</div>
            </div>
          </div>
        </div>

      </div>
    </div>
</template>

<script>
  //import {ax,host} from "./main.js"
    var ax;
    export default {
        name: "LoginBlock",
        props: [],
        data: function () {
            return {
              shown: true,
              host:this.$store.state.host,
              warning: '',
              guest: false,
              sendNewPswd: false,
              codeStatus: false,
              //shop: false,
              mail:{value:'', type:'mail', valid:'false'},
              username:{value:'', type:'mail', valid:'false'},
              password:{value:'', type:'mail', valid:'false'},
              rePassword:{value:'', type:'mail', valid:'false'},
              capt:'',
              code:'',
            }
        },
        computed:{
          pswdIsValid: function () {
            if (this.password.value===this.rePassword.value) return true;
            else return false;
          },
          contentType: function () {
            let ans = 'common';
            if (this.guest) {
              ans = 'register';
              this.refreshForm();
            }
            else if (this.sendNewPswd) ans = 'remind';
            return ans;
          },
        },
        methods:{
          show: function(isGuest){
            this.guest = isGuest;
            this.shown=true;
          },
          hide:function(){
            this.shown=false;
          },
          refreshForm: function (){
            this.sendNewPswd = false;
            this.codeStatus = false;
            //this.$forceUpdate();
          },
          login: function () {
            //if (this.guest) return;
            var vm=this;
            ax.get("/shared/get-csrf-token")
              .then(function (data1) {
                  console.log(data1.data);
                  var fd = new FormData;
                  fd.append('csrfmiddlewaretoken', data1.data);
                  fd.append('user', vm.mail.value);
                  fd.append('password', vm.password.value);
                  ax.post("/account/login", fd, {
                    headers: {
                      'X-CSRFToken': data1.data,
                      'Content-Type': 'multipart/form-data'
                    }
                  })
                    .then(function (data) {
                        window.location.reload();
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
                  if(data.response){
                    console.warn(data.response.data);
                  }
                  else
                    console.warn('no connection')
                }
              )
          },
          register: function () {
            var vm=this;
            if (!this.pswdIsValid) {
              console.warn('invalid passwords')
              vm.warning='Пароли не совпадают';
              return;
            }
            ax.get("/shared/get-csrf-token")
              .then(function (data1) {
                  console.log(data1.data);
                  var fd = new FormData;
                  fd.append('csrfmiddlewaretoken', data1.data);
                  fd.append('login', vm.mail.value);
                  fd.append('password', vm.password.value);
                  fd.append('username', vm.username.value);
                  ax.post("/account/new-account", fd, {
                    headers: {
                      'X-CSRFToken': data1.data,
                      'Content-Type': 'multipart/form-data'
                    }
                  })
                    .then(function (data) {
                        console.log(data.data);
                        vm.login();
                        vm.refreshForm();
                        vm.hide();
                        console.log('done?');
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
                  if(data.response){
                    console.warn(data.response.data);
                  }
                  else
                    console.warn('no connection')
                }
              )
          },
          validateInput:function(e,param, type){
            //console.log(e);

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
              //val = val.replace(/,/g,'.');
              e.target.value = val.replace(',','.');
              /*e.target.value = val;
              this.$forceUpdate();*/
            }
          },
        },

        created:function () {
          ax = this.$axios.create({  baseURL: this.host});
        }
    }
</script>

<style lang="sass" scoped>
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  .LoginBlock
    background-color: white
    position: fixed
    box-shadow: $shadow
    margin-left: -700px
    width: 750px
    margin-top: 50px
    text-align: right
    font-size: 18px
    .switch
      margin: 20px
      cursor: pointer
    .content
      //padding: 30px 150px 50px 70px
      //width: 550px
      margin: 30px 140px 50px 0
      .warning
        height: 20px
        width: 360px
        text-align: center
        display: inline-block
        .redtext
          color: darkred
          display: inline-block
      .line
        margin-top: 20px
        .label
          display: inline-block
        input
          width: 350px
          height: 37px
          margin-left: 30px
          padding-left: 10px
          font-family: Philosopher
      .captcha
        margin-top: 30px
        img
          height: 60px
          width: 180px
          background-color: darkgray
          vertical-align: top
        input
          margin-left: 10px
          height: 55px
          font-size: 18px
          padding-left: 20px
          width: 145px
          font-family: Philosopher
      .check
        margin-top: 20px
        margin-right: 115px
        .label
          display: inline-block
      .remind
        display: inline-block
        color: darkgray
        font-size: 15.5px
        margin-left: 105px
        cursor: pointer
        vertical-align: bottom
      .btns
        margin-top: 20px
        text-align: right
      .btn
        text-align: center
        display: inline-block
        margin-left: 15px
        padding: 10px 5px 10px 10px
        box-shadow: $shadow
        width: 130px
        font-size: 15.5px
      .sendNewPswdBlock
        .btn
          width: 250px
          margin: 25px
      .reg
        .btn
          width: 150px
          margin-left: 30px

</style>
