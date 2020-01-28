<template>
  <div class="UserBar">
    <span v-if="!$store.state.user.anonymous" class="username" @click="showOptions=true; myScroll();">{{username}}</span>
    <span v-else >
      <span class="username" @click="$refs.loginBlock.show(false);">Вход</span>
      <!--<span class="username" @click="$refs.loginBlock.show(true);">/Регистрация</span>-->
    </span>
    <div v-if="showOptions" class="options">
      <div class="bg" @click="showOptions=false"></div>
      <div class="option" @click="logout(); showOptions=false">Выйти</div>
      <div class="option" @click="$refs.loginBlock.show(false); showOptions=false">Сменить пользователя</div>
    </div>
    <img v-if="!$store.state.user.anonymous" :src="host+'/static/img/shared/basket-32.png'" />
    <img v-if="!$store.state.user.anonymous" :src="host+'/static/img/shared/star-32.png'"/>
    <login-block ref="loginBlock" ></login-block>
  </div>
</template>

<script>
    import LoginBlock from "./LoginBlock";
    var ax;
    export default {
      name: "UserBar",
      components: {LoginBlock},
      data: function () {
        return {
          showOptions: false,
          host:this.$store.state.host,
        }
      },
      methods: {
        logout: function () {
          ax.get("/shared/get-csrf-token")
          .then(function(data1){
            console.log(data1.data);
            var fd = new FormData;
            fd.append('csrfmiddlewaretoken', data1.data);
            ax.post("/account/logout", fd, {
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
          })
          .catch(function (data) {
              if(data.response){
                console.warn(data.response.data);
              }
              else
                console.warn('no connection')
            }
          )
        },
        myScroll:function(){
          let vm = this;
          //console.log('!...!');
          window.onscroll = () => {
            //let bottomOfWindow = Math.abs(document.documentElement.offsetHeight - (document.documentElement.scrollTop + window.innerHeight)) < true;
            //if (bottomOfWindow) this.loadCards();
            //console.log('!!');
            vm.showOptions=false;
          };
        },

      },
      computed:{
        username: function () {
          let ans = this.$store.state.user.username
          if (!ans) return 'ERROR';
          if(ans.length>10) return ans.substring(0,10)+'...';
          else return ans;
        }
      },
      mounted: function () {
        let vm = this;
        this.myScroll();
        ax = this.$axios.create({  baseURL: this.host});
        ax.get(this.host + '/account/about-me')
          .then(function (data) {
              console.log(data.data);
              vm.$store.state.user.anonymous = data.data.anonymous;
              if(data.data.anonymous) vm.$store.state.user.username = '';
              else vm.$store.state.user.username = data.data.username;
              vm.$store.state.user.stock = data.data['stock-occupied'];
              vm.$store.state.user.stockMax = data.data['stock-capacity'];
              //vm.$forceUpdate();
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
    }
</script>

<style lang="sass" scoped>
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  $lgray: #f6f6f6
  $myblue: #182b93
  .UserBar
    //border: solid red 1px
    //margin: 20px
    //background-color: orangered
    display: inline
    float: right
    margin: 20px 48px 0 0
    .options
      position: fixed
      background-color: white
      box-shadow: $shadow
      font-size: 18px
      margin-left: -100px
      margin-top: 30px
      padding: 10px
      .bg
        height: 100vh
        width: 100vw
        position: fixed
        left: 0
        top: 0
        z-index: -1
      .option
        padding: 5px
        cursor: pointer
        &:hover
          color: $myblue
    img
      height: 32px
      float: right
    .username
      //margin-right: 20px
      //margin-left: 80px
      float: left
      margin-top: 5px
      font-size: 18px
      cursor: pointer
      max-width: 125px
      overflow: hidden
      &:hover
        color: $myblue
</style>
