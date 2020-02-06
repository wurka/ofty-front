<template>
  <div class="layout" :class="{hidden: notLoaded, visible: !notLoaded}">
    <SiteHeader ref="siteHeader"/>
    <div class="flex">

      <div class="basketContent t1-1">
        <div v-for="(block, index) in this.$store.state.basket.blocks" v-bind:key="block+index">
          <div class="flex">
            <div class="ownerInfo t1-3">
              <div class="name">
                {{block['owner'].name}}
              </div>
              <div class="conditions t1-5" v-if="block['owner']['rent-commentary'] !== ''">
                Условия доставки:<br>
                {{block['owner']['rent-commentary']}}
              </div>
            </div>
            <div class="units t1-5">
              <div class="unit" v-for="(unit, u_index) in block.units" v-bind:key="unit+u_index">
                <!--{{unit}}-->
                <div class="aboutUnit">
                  <div class="photo">
                    <img :src="unit['data']['photo1']"
                         v-if="unit['data']['photo1']"
                         alt="photo" width="120" height="120">
                    <span v-else class="t1-5 noPhoto">нет фото</span>
                  </div>
                  <div class="text">
                    <div class="title t1-3">
                      {{unit['data']['title']}}
                    </div>
                  </div>
                  <div class="buttons">
                    <div class="button">В избранное</div>
                    <div class="button" @click="deleteUnit(unit['data']['id'])">Удалить</div>
                  </div>
                </div>
                <div class="dates">
                  <div class="from">
                    <label :for="'fromUnit'+u_index" class="t1-4">Начало аренды:</label>
                    <input type="text" :id="'fromUnit'+u_index">
                    <label :for="'toUnit'+u_index" class="t1-4">Окончание аренды:</label>
                    <input type="text" :id="'toUnit'+u_index">
                    <div class="costs">
                      <div class="line">
                        <span>Стоимость товаров:</span>
                        <span>думаем...</span>
                      </div>
                      <div class="line">
                        <span>Залог:</span>
                        <span>х</span>
                        <span>р</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="commentaries">
                  <div class="title t1-4">Комментарий:</div>
                  <div class="textarea" contenteditable></div>
                </div>
                <div class="request">
                  <div class="button">Отправить запрос</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import SiteHeader from "../../components/shared/SiteHeader";
  import OfficeMenu from "../../components/shared/OfficeMenu";
  export default {
    name: "basket.vue",
    components: {OfficeMenu, SiteHeader},
    data() { return {
      notLoaded: true,
    }},
    methods: {
      deleteUnit(unit_id) {
        let fd = new FormData;
        fd.append('unit-id', unit_id);
        axios
          .post(this.$store.state.host + "/basket/remove-unit", fd, {
            headers: {
              'X-CSRFToken': this.$store.state.csrf,
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(()=>{this.$refs.siteHeader.downloadBasket()})
          .catch((data)=>{console.warn(data.response.data)});
      }
    },
    mounted() {
      this.notLoaded = false;
      //this.downloadBasket();
      axios
        .get(this.$store.state.host + "/csrf")
        .then((response)=>{this.$store.state.csrf = response.data});
      this.$refs.siteHeader.downloadBasket();
    },
  }
</script>

<style lang="sass">
  body
    background: lightgray
    margin: 0
    font-family: philosopher, serif
</style>

<style scoped lang="sass">
  .layout
    width: 1140px
    margin: auto
    background: white
  .flex
    display: flex
  .ownerInfo
    width: 205px
    padding: 18px 18px 18px 33px
  .conditions
    line-height: 28px
  .units
    width: 880px
  .aboutUnit
    background: #f6f6f6
    display: flex
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
    margin: 0 10px 25px 0
    .photo
      width: 150px
      img
        margin: 19px
    .noPhoto
      display: inline-block
      margin: 30px 0 0 40px
    .text
      flex-grow: 1
      .title
        padding: 10px 0 0 0
      &::first-letter
        text-transform: uppercase
    .buttons
      width: 220px
  .button
    background: white
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
    border: thin solid #c4c4c4
    width: 190px
    text-align: center
    line-height: 37px
    margin-bottom: 20px
    user-select: none
    cursor: default
    &:hover
      background: #fafafa
    &:active
      transform: scale(0.95)
    &:first-child
      margin: 19px 0 16px 0
  .dates
    .from
      label
        display: inline-block
        line-height: 27px
        margin: 0 10px 0 0
        vertical-align: top
      input
        line-height: 27px
        width: 80px
        display: inline-block
        margin-right: 38px
        vertical-align: top
      .costs
        display: inline-block
        .line
          display: flex
          span:first-child
            display: inline-block
            min-width: 150px
          span:nth-child(3)
            display: inline-block
            margin-left: 5px
  .request
    text-align: center
    .button
      display: inline-block
  .commentaries
    overflow: hidden
    word-break: keep-all
    white-space: nowrap
    margin-top: 40px
    .title
      display: inline-block
      width: 138px
      vertical-align: top
    .textarea
      width: 732px
      box-sizing: border-box
      resize: none
      display: inline-block
      border: 1px solid #c4c4c4
      padding: 6px
      line-height: 17px

</style>
