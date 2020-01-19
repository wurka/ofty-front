<template>
    <div class="Dialogs">
      <div class="gen flag"></div>
      <div v-for="d in dialogs" class="dialog" @click="activeId=d.id; $forceUpdate();">
        <div class="ico"></div>
        <div class="mid">
          <div class="name">{{d.title}}</div>
          <div class="text">{2{d.text}}</div>
        </div>
        <div class="right">
          <div class="flag"></div>
          <div class="time">{{d.id}}</div>
        </div>
      </div>
      <chat-body :chatId="activeId"></chat-body>
    </div>
</template>

<script>
  import {ax,host} from "./main";
  import ChatBody from "./ChatBody";

  export default {
    name: "Dialogs",
    components: {ChatBody},
    data: function () {
        return {
          dialogs:[],
          activeId: '',
        }
    },
    methods:{
      loadDialogs: function () {
        let vm = this;
        ax.get(host+'/message/my-conversations')
          .then(function(data){
              //console.log(data.data );
              vm.dialogs = data.data;
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
    created:function () {
      this.loadDialogs();
    }
  }
</script>

<style lang="sass" scoped>
  $lgray: #f6f6f6
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  .Dialogs
    width: 860px
    //min-height: 500px
    margin-top: 25px
    .flag.gen
      height: 32px
      width: 32px
      background-color: gray
      cursor: pointer
      float: right
      margin: -40px 10px 0 0
    .dialog
      background-color: $lgray
      box-shadow: $shadow
      padding: 10px
      margin-bottom: 15px
      cursor: pointer
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
      .right
        float: right
        .flag
          height: 32px
          width: 32px
          //margin: 10px 9px 0 9px
          background-color: gray
          cursor: pointer
        .time
          vertical-align: bottom
          text-align: right
          margin-top: 25px
</style>
