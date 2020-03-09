<template>
  <div class="searchBody">
    <div class="no-items t1-2" v-if="(units.length === 0) && (!loading)">
      К сожалению, ниодин товар не найден...
    </div>
    <div class="no-items t1-2" v-if="loading">
      Загрузка...
    </div>
    <div class="items">
      <div class="item" v-for="unit in units" v-bind:key="'item#'+unit.id">
        <div class="buttons">
          <div class="left">
            <div class="button like" @click="unitLike(unit.id)" title="Поставить лайк">
              <img :src="$store.state.host+'/static/img/shared/like.svg'" alt="like">
            </div>
            <div class="button dislike" @click="unitDislike(unit.id)" title="Поставить дизлайк">
              <img :src="$store.state.host+'/static/img/shared/dislike.svg'" alt="dis">
            </div>
            <div class="button asterisk" @click="unitAlert(unit.id)" title="Пожаловаться на товар">
              <img :src="$store.state.host+'/static/img/shared/asterisk.svg'" alt="!">
            </div>
          </div>
          <div class="right">
            <div class="button basket" @click="unitBasket(unit.id)" title="Добавить в корзину">
              <img :src="$store.state.host+'/static/img/shared/basket.svg'" alt="bask">
            </div>
            <div class="button star" @click="unitStar(unit.id)" title="Добавить в избранное">
              <img :src="$store.state.host+'/static/img/shared/star.svg'" alt="str">
            </div>
            <div class="button collection" @click="unitCollection(unit.id)" title="Добавить в коллекцию">
              <img :src="$store.state.host+'/static/img/shared/kollection.svg'" alt="K">
            </div>
          </div>
        </div>
        <a class="picture" :href="'/unit?id='+unit.id">
          <!--<img src="https://dummyimage.com/155x155.svg" alt="155">-->
          <img :src="unit.photo1" alt="not found" width="155" height="155">
        </a>
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
          loading: true,
        }},
        methods: {
          downloadBasket(){
            axios
              .get(this.$store.state.host + "/basket/get-content")
              .then((response)=>{
                this.$store.state.basket.blocks = response.data;
                let count = 0;
                response.data.forEach((block)=>{
                  block['units'].forEach((item)=>{
                    if (item.type === 'unit'){count += 1;}
                  });
                });
                this.$store.state.basket.count = count;
              })
              .catch(()=>{console.warn('error while download basket')})
          },
          unitLike(unitId) {
            // check for login
            if (this.$store.state.user.anonymous) {
              this.$emit('loginRequest');
              return;
            }
            console.log('i like unit ' + unitId);
          },
          unitDislike(unitId) {
            // check for login
            if (this.$store.state.user.anonymous) {
              this.$emit('loginRequest');
              return;
            }
            console.log('i dislike unit ' + unitId);
          },
          unitAlert(unitId) {
            // check for login
            if (this.$store.state.user.anonymous) {
              this.$emit('loginRequest');
              return;
            }
            console.log('omg, this is unit: ' + unitId);
          },
          unitBasket(unitId) {
            // check for login
            if (this.$store.state.user.anonymous) {
              this.$emit('loginRequest');
              return;
            }


            console.log('i put unit to basket: ' + unitId);
            let fd = new FormData(),
                vm = this;
            fd.append('unit-id', unitId);
            axios
              .post(this.$store.state.host + "/basket/add-unit",
                fd,
                {headers:{'X-CSRFToken': this.$store.state.csrf}})
              .then(()=>{
                vm.downloadBasket();
              })
              .catch((response)=>{console.log(response.response.data);})
          },
          unitStar(unitId) {
            // check for login
            if (this.$store.state.user.anonymous) {
              this.$emit('loginRequest');
              return;
            }
            console.log('my favorite unit is ' + unitId);
          },
          unitCollection(unitId) {
            // check for login
            if (this.$store.state.user.anonymous) {
              this.$emit('loginRequest');
              return;
            }
            console.log('put to collection: ' + unitId);
          },
          getUnits(){
            axios
              .get(this.$store.state.host + "/units/get-all-units")
              .then((resp)=>{
                this.units = resp.data;
                this.loading = false;
              })
              .catch(()=>{this.loading=false; console.warn("fuck it")})
          }
        },
        mounted() {
          this.getUnits();
        }
    }
</script>

<style scoped lang="sass">
  .no-items
    text-align: center
    margin: 150px auto 0 auto
    color: gray
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
      color: black
      background: white
      width: 155px
      height: 155px
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
      display: inline-block
      img
        display: inline-block
        width: 155px
        height: 155px
        box-sizing: border-box
    .text
      font-family: Tahoma, serif
      background: #f6f6f6
      line-height: 36px
      padding-left: 10px
      font-size: 14px
      color: #8A8888
      margin-top: 5px
</style>
