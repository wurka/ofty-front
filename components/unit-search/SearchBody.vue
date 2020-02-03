<template>
  <div class="searchBody">
    this is search body div
    <div class="items">
      <div class="item" v-for="unit in units" v-bind:key="'item#'+unit.id">
        <div class="buttons">
          <div class="left">
            <div class="button like" @click="unitLike(unit.id)">
              <img :src="$store.state.host+'/static/img/shared/like.svg'" alt="like">
            </div>
            <div class="button dislike" @click="unitDislike(unit.id)">
              <img :src="$store.state.host+'/static/img/shared/dislike.svg'" alt="dis">
            </div>
            <div class="button asterisk" @click="unitAlert(unit.id)">
              <img :src="$store.state.host+'/static/img/shared/asterisk.svg'" alt="!">
            </div>
          </div>
          <div class="right">
            <div class="button basket" @click="unitBasket(unit.id)">
              <img :src="$store.state.host+'/static/img/shared/basket.svg'" alt="bask">
            </div>
            <div class="button star" @click="unitStar(unit.id)">
              <img :src="$store.state.host+'/static/img/shared/star.svg'" alt="str">
            </div>
            <div class="button collection" @click="unitCollection(unit.id)">
              <img :src="$store.state.host+'/static/img/shared/kollection.svg'" alt="K">
            </div>
          </div>
        </div>
        <div class="picture" onclick="window.alert('daboo dee')">
          <!--<img src="https://dummyimage.com/155x155.svg" alt="155">-->
          <img :src="unit.photo1" alt="155" width="155" height="155">
        </div>
        <div class="text">
          <span>{{unit['day-cost']}}</span>
          <span v-if="unit['day-cost'] !== unit['first-day-cost']">({{unit['first-day-cost']}})</span>
          <span>р/день</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import axios from "axios";
    export default {
        name: "SearchBody",
        data() { return {
          units: [],
        }},
        methods: {
          unitLike(unitId) {
            console.log('i like unit ' + unitId);
          },
          unitDislike(unitId) {
            console.log('i dislike unit ' + unitId);
          },
          unitAlert(unitId) {
            console.log('omg, this is unit: ' + unitId);
          },
          unitBasket(unitId) {
            console.log('i put unit to basket: ' + unitId);
          },
          unitStar(unitId) {
            console.log('my favorite unit is ' + unitId);
          },
          unitCollection(unitId) {
            console.log('put to collection: ' + unitId);
          },
          getUnits(){
            axios
              .get(this.$store.state.host + "/units/get-all-units")
              .then((resp)=>{
                this.units = resp.data;
              })
              .catch(()=>{console.warn("fuck it")})
          }
        },
        mounted() {
          this.getUnits();
        }
    }
</script>

<style scoped lang="sass">
  .buttons
    display: none
  .item:hover
    .buttons
      display: flex
  .searchBody
    flex-grow: 1
    .item
      display: inline-block
      height: 191px
      width: 155px
      margin: 10px
    .buttons
      // display: flex
      position: absolute
      width: 155px
      pointer-events: none
      .button
        pointer-events: all
        cursor: pointer
        width: 24px
        height: 24px
        border-radius: 12px
        box-sizing: border-box
        border: 1px solid gray
        display: block
        background: white
        margin: 3px
        font-size: 10px
        color: gray
        user-select: none
        &:hover
          transform: scale(1.05)
        &:active
          transform: scale(0.9)
      .left
        flex-grow: 1
        display: flex
        flex-direction: column
        align-items: flex-start
      .right
        flex-grow: 1
        display: flex
        flex-direction: column
        align-items: flex-end
    .picture
      background: white
      width: 155px
      height: 155px
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
    .text
      font-family: Tahoma, serif
      background: #f6f6f6
      line-height: 36px
      padding-left: 10px
      font-size: 14px
      color: #8A8888
      margin-top: 5px
</style>
