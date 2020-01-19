<template>
    <div class="MainTitleBlock">
      <div class="leftBlock">
        <div class="content">
          <span>
            Более 5000 элементов декора и оборудования в аренду от крупнейших компаний.
          </span>
          <div class="btn">Взять в аренду</div>
          <div class="btn" @click="">Сдать в аренду</div>
        </div>
      </div>
      <div class="rightBlock">
        <img class="bigImg" :src="host+'/static/img/shared/uriy.svg'"/>
      </div>
    </div>
</template>

<script>
  import {host} from "./main";

  export default {
        name: "MainTitleBlock",
        data: function () {
            return {
              host:host,
            }
        }
    }
</script>

<style lang="sass" scoped>
  $lgray: #f6f6f6
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  .MainTitleBlock
    //background-color: red
    height: 550px
    .leftBlock
      width: 359px
      height: 527px
      background-color: $lgray
      font-size: 31px
      font-weight: bold
      //padding: 25px
      display: inline-block
      vertical-align: top
      .content
        margin: 37px 0 0 45px
        width: 276px
        span
          line-height: 50px

        .btn
          margin-top: 30px
          font-size: 18px
          padding: 8px 5px 8px 10px
          box-shadow: $shadow
          text-align: center
          width: 200px
    .rightBlock
      display: inline-block
      margin-left: 15px
      img
        background-color: darkgray
        height: 527px
        width: 726px


</style>
