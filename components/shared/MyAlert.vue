<template>
  <div class="MyAlert">
    <div v-if="shown">
      <div class="bg" @click="hide"></div>
      <div class="alertContent">
        <div class="text">{{params.text}}</div>
        <div v-for="(b,index) in params.btns" :key="index" class="btn" @click="onClick(b)"><span>{{b.text}}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MyAlert",
    props:["params"],
    data: function () {
      return {
        host:this.$store.state.host,
        shown: false,
      }
    },
    methods:{
      show:function(){
        //console.log('show info');
        this.shown = true;

      },
      hide:function () {
        //console.log('hide info');
        this.shown = false;
      },
      onClick:function (b) {
        this.$emit(b.name);
        if(b.name==='close') this.hide();
      }
    }
  }
</script>

<style lang="sass" scoped>
  $lgray: #f6f6f6
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  $myred: #CA1612
  .MyAlert
    .bg
      background-color: darkgray
      opacity: 0.3
      position: fixed
      left: 0
      top: 0
      height: 100vh
      width: 100vw
    .alertContent
      position: absolute
      width: 628px
      min-height: 208px
      background: #FFFFFF
      border: 0.5px solid #C4C4C4
      box-sizing: border-box
      box-shadow: $shadow
      text-align: center
      padding-bottom: 20px
      .text
        font-size: 21px
        margin-top: 52px
      .btn
        width: 200px
        display: inline-block
        font-size: 18px
        margin: 64px 5px 5px 5px
        padding: 10px 0 10px 0
</style>
