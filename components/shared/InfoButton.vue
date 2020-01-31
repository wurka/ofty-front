<template>
    <div class="InfoButton">
      <img :src="host+'/static/img/shared/info.png'" class="infoImg" @click="show"/>
      <div v-if="shown">
        <div class="bg" @click="hide"></div>
        <div class="infoContent">
          {{title}}
        </div>
      </div>

    </div>
</template>

<script>
    export default {
      name: "InfoButton",
      props:["title"],
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
        }
      }
    }
</script>

<style lang="sass" scoped>
  .InfoButton
    .bg
      background-color: darkgray
      opacity: 0.3
      position: fixed
      left: 0
      top: 0
      height: 100vh
      width: 100vw
      //z-index: 2
    .infoImg
      cursor: pointer
    .infoContent
      font-size: 15.5px
      color: gray
      padding: 5px
      background-color: white
      border: solid gray thin
      position: absolute
      pointer-events: none
</style>
