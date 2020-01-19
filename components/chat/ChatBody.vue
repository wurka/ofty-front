<template>
    <div v-if="shown" class="ChatBody">
      <div class="msgPanel">
        <div v-for="m in messages" class="msg">
          <div class="ico"></div>
          <div class="mid">
            <div class="name">{{m.author_name}}</div>
            <div class="text">{{m.text}}</div>
          </div>

          <div class="time">{{m.id}}</div>
        </div>
      </div>
      <div class="menu"></div>
      <div class="inputPanel">
        <textarea placeholder="Напишите сообщение" @keydown.enter="prevent" @keyup.enter="sendMsg" v-model="newMsg"></textarea>
        <div class="add"></div>
      </div>
    </div>
</template>

<script>
    import {host, ax} from "./main";

    export default {
      name: "ChatBody",
      props:['chatId'],
      data: function () {
          return {
            shown:true,
            messages:[],
            dialogId: '',
            newMsg:'',
          }
      },
      methods:{
        loadMessages: function () {
          let vm = this;
          ax.get(host+'/message/get-before',{'params':{
              'conversation': this.dialogId,
              'beforeid': -1,
              'size': 4,
            }})
            .then(function(data){
                //console.log(data.data );
                vm.messages = data.data;
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
        sendMsg: function (e) {
          let vm = this;
          var fd = new FormData;
          e.preventDefault();
          fd.set('conversation', vm.dialogId);
          fd.set('message', vm.newMsg);

          ax.get("/shared/get-csrf-token")
            .then(function(data1){
                //ax.post("/units/add-new-unit", fd,{headers:{'X-CSRFToken':data1.data,'Content-Type': 'multipart/form-data'}})
              ax.post(host+'/message/new-message',/*{'params':{
                  'conversation': vm.dialogId,
                  'message': vm.newMsg,
                }}*/fd, {headers:{'X-CSRFToken':data1.data,'Content-Type': 'multipart/form-data'}})
                .then(function(data){
                    vm.newMsg='';
                    vm.loadMessages();
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
              }
            )
            .catch(function(data){
                console.warn(data);
              }
            )
          /*ax.post(host+'/message/new-message',{'params':{
              'conversation': this.dialogId,
              'message': this.newMsg,
            }})
            .then(function(data){
                //console.log(data.data );
                this.newMsg='';
                //vm.messages = data.data;
                vm.loadMessages()
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
            );*/
        },
        prevent:function (e) {
          e.preventDefault();
        },
      },
      watch:{
        chatId:function () {
          this.dialogId = this.chatId;
          this.loadMessages();
        }
      },
      created: function () {

        //this.loadMessages();
      }
    }
</script>

<style lang="sass" scoped>
  $lgray: #f6f6f6
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  .ChatBody
    background-color: $lgray
    box-shadow: $shadow
    width: 860px
    min-height: 500px
    margin-top: 25px
    .msgPanel
      width: 810px
      //background-color: darkgray
      min-height: 370px
      display: inline-block
      .msg
        margin: 15px
        //background-color: lightgray
        .ico
          display: inline-block
          width: 70px
          height: 70px
          background-color: lightsalmon
          margin-right: 25px
        .mid
          display: inline-block
          vertical-align: top
          .name
            font-size: 24px
            margin-bottom: 10px
          .text
            font-size: 18px
        .time
          display: inline-block
          vertical-align: top
          float: right
          margin: 5px



    .menu
      height: 32px
      width: 32px
      float: right
      margin: 10px 9px 0 9px
      background-color: gray
      display: inline-block
      vertical-align: top
      cursor: pointer
    .inputPanel
      margin-top: 30px
      margin-left: 15px
      textarea
        width: 730px
        font-size: 18px
        resize: none
        padding-left: 30px
        padding-top: 10px
        padding-right: 40px
        display: inline-block
        margin-bottom: 18px
      .add
        display: inline-block
        height: 32px
        width: 32px
        background-color: lightgray
        vertical-align: top
        margin-left: -45px
        margin-top: 5px
        cursor: pointer



</style>
