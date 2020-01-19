<template>
    <div class="LoginBlock" v-if="shown">
      <div class="switch btn" @click="guest=!guest">
        <span v-if="guest">Войти</span>
        <span v-else>Зарегистрироваться</span>
      </div>
      <div class="content">

        <div class="warning">{{warning}}</div>
        <div class="line">
          <div class="label">Почта</div>
          <input v-model="username" />
        </div>
        <div class="line">
          <div class="label">Пароль</div>
          <input type="password" v-model="password" @keyup.enter="login()"/>
        </div>
        <div v-if="guest">
          <div class="line">
            <div class="label">Пароль еще раз</div>
            <input type="password" v-model="rePassword"/>
          </div>
          <div class="line">
            <div class="label">Почта</div>
            <input/>
          </div>
          <div class="captcha">
            <img :src="host+'/static/img/shared/uriy.svg'"/>
            <input/>
          </div>
          <div class="check">
            <input type="checkbox" v-model="shop"/>
            <div class="label">Хочу сдавать декор в аренду</div>
          </div>
          <div v-if="shop">
            <div class="line">
              <div class="label">Название компании</div>
              <input/>
            </div>
            <div class="line">
              <div class="label">Сайт</div>
              <input/>
            </div>
            <div class="line">
              <div class="label">Телефон</div>
              <input/>
            </div>
            <div class="line">
              <div class="label">Условия аренды</div>
              <input/>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="remind" @click="sendNewPswd=!sendNewPswd">Напомнить пароль</div>
          <div class="sendNewPswdBlock" v-if="sendNewPswd">
            <div class="line">
              <div class="label">Телефон/Почта</div>
              <input/>
              <div class="btn" >Отправить</div>
            </div>
          </div>
        </div>

        <div class="btns">
          <div class="btn" @click="hide()">Отмена</div>
          <div class="btn" v-if="guest" @click="register()">Подтвердить</div>
          <div class="btn" v-else @click="login()">Войти</div>
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
              shown: false,
              host:this.$store.state.host,
              warning: '',
              guest: false,
              sendNewPswd: false,
              shop: false,
              username:'',
              password:'',
              rePassword:''
            }
        },
        computed:{
          pswdIsValid: function () {
            if (this.password==this.rePassword) return true;
            else return false;
          }
        },
        methods:{
          show: function(isGuest){
            this.guest = isGuest;
            this.shown=true;
          },
          hide:function(){
            this.shown=false;
          },
          login: function () {
            if (this.guest) return;
            var vm=this;
            ax.get("/shared/get-csrf-token")
              .then(function (data1) {
                  console.log(data1.data);
                  var fd = new FormData;
                  fd.append('csrfmiddlewaretoken', data1.data);
                  fd.append('user', vm.username);
                  fd.append('password', vm.password);
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
            if (!this.pswdIsValid) return;
            ax.get("/shared/get-csrf-token")
              .then(function (data1) {
                  console.log(data1.data);
                  var fd = new FormData;
                  fd.append('csrfmiddlewaretoken', data1.data);
                  fd.append('login', vm.username);
                  fd.append('password', vm.password);
                  ax.post("/account/new-account", fd, {
                    headers: {
                      'X-CSRFToken': data1.data,
                      'Content-Type': 'multipart/form-data'
                    }
                  })
                    .then(function (data) {
                        console.log(data.data);
                        vm.shown=false;
                        vm.guest=false;
                        vm.login();
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
    margin-top: 50px
    text-align: right
    font-size: 18px
    .switch
      margin: 20px
    .content
      padding: 30px 150px 50px 70px
      width: 550px
      .warning
        color: darkred
        height: 20px
      .line
        margin-top: 20px
        .label
          display: inline-block
        input
          width: 350px
          height: 37px
          margin-left: 30px
      .captcha
        margin-top: 30px
        img
          height: 55px
          width: 110px
          background-color: darkgray
          vertical-align: top
        input
          margin-left: 20px
          height: 50px
          font-size: 30px
          width: 250px
      .check
        margin-top: 20px
        margin-right: 115px
        input

        .label
          display: inline-block
      .remind
        color: darkgray
        margin: 10px
        cursor: pointer
      .btns
        margin-top: 20px
      .btn
        text-align: center
        display: inline-block
        margin-left: 80px
        padding: 8px 5px 8px 10px
        box-shadow: $shadow
        width: 150px
      .sendNewPswdBlock
        .btn
          width: 250px
          margin: 25px

</style>
