<template>
  <div class="layout" :class="{hidden: notLoaded, visible: !notLoaded}">
    <SiteHeader ref="siteHeader"/>
    <transition name="fade">
      <div v-if="notLoaded" style="position: absolute; width: 1140px; height:80vh; background: white; z-index: 100">
        <img :src="this.$store.state.host+'/static/img/shared/crazy-owl.gif'" style="position: absolute; left: 50vw; top: 10vh; margin-left:-200px">
      </div>
    </transition>

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
                    <div class="flex">
                      <div class="parameters">
                        <div class="parameter t1-5" v-for="parameter in unit['data']['parameters']"
                             :key="'p'+parameter['id']+'u'+unit['data']['id']">
                            {{parameter['name']}}={{parameter['value']}}{{parameter['dimension']}}
                        </div>
                      </div>
                      <div class="countAndCost">
                        <p class="t1-5">Количество: <input type="text" :value="unit['order-count']"
                                                           @input="countChanges($event, block, unit)"
                                                           class="countInput t2-5">
                          <span>/{{unit['data']['count']}}</span>
                          <span>шт.</span></p>
                        <p class="firstDay t1-5">
                          <span>Стоимость первых суток:</span><span class="fdCost">{{unit['data']['first-day-cost']}}</span><span class="span">р</span>
                        </p>
                        <p class="otherDays t1-5">
                          <span>Стоимость последующих суток:</span><span class="fdCost">{{unit['data']['day-cost']}}</span><span class="span">р</span>
                        </p>
                        <p class="bail t1-5">
                          <span>Залог:</span>
                          <transition name="slide-fade" mode="out-in">
                            <span class="fdCost">{{unit['data']['bail']}}</span>
                          </transition>
                          <span class="span">р</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="buttons">
                    <div class="button">В избранное</div>
                    <div class="button" @click="deleteUnit(unit['data']['id'])">Удалить</div>
                  </div>
                </div>
              </div>
              <div class="dates">
                <div class="from">
                  <label :for="'fromUnit'+index" class="t1-4">Начало аренды:</label>
                  <input type="text" :id="'fromUnit'+index" class="timepicker" v-model="block['from']" @input="calculateCost(block)">
                  <label :for="'toUnit'+index" class="t1-4">Окончание аренды:</label>
                  <input type="text" :id="'toUnit'+index" v-model="block['to']" @input="calculateCost(block)">
                  <div class="costs">
                    <div class="line">
                      <span class="t1-5">Стоимость товаров:</span>
                      <span class="t1-5">{{block['cost']}}</span>
                    </div>
                    <div class="line t1-5">
                      <span>Залог:</span>
                      <span>{{block['bail']}}</span>
                      <span>р</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="commentaries">
                <div class="title t1-4">Комментарий:</div>
                <span class="placeholder" v-if="block['commentary'] === ''">Введите комментарий</span>
                <div class="textarea" contenteditable @input="inputCommentary($event, block)"></div>
              </div>
              <div class="request t1-5">
                <div class="button" :class="{disabled: !block.ok}" @click="newOrder(block)">Отправить запрос</div>
                <span v-if="!block.ok">Корректно заполните все поля</span>
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
  import {blockBailAndCost, removeItem, decodeHTMLEntities} from "~/static/myTools";


  export default {
    name: "basket.vue",
    components: {OfficeMenu, SiteHeader},
    data() { return {
      notLoaded: true,
    }},
    methods: {
      inputCommentary(event, block) {
        this.$set(block, 'commentary',event.target.innerHTML);
      },
      countChanges(event, block, unit) {
        this.$set(unit, 'order-count',event.target.value);
        this.calculateCost(block);
      },
      calculateCost(block){
        let info = blockBailAndCost(block);
        this.$set(block, 'bail', info.bail);
        this.$set(block, 'cost', info.cost);
        this.$set(block, 'ok', info.ok);
      },
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
      },
      newOrder(block){
        // "owner", "commentary", "start-date", "stop-date", "bail", "cost", "units"
        let fd = new FormData(),
            units = [];
        fd.append('owner', block['owner'].id);
        fd.append('commentary', decodeHTMLEntities(block['commentary']));
        fd.append('start-date', block['from']);
        fd.append('stop-date', block['to']);
        fd.append('bail', block['bail']);
        fd.append('cost', block['cost']);

        block['units'].forEach((unit)=>{
          units.push({
            'id': unit['data']['id'],
            'count': unit['order-count']
          });
        });
        fd.append('units', JSON.stringify(units));

        axios
          .post(this.$store.state.host + "/orders/new-order", fd, {
            headers: {
              'X-CSRFToken': this.$store.state.csrf,
              'Content-Type': 'multipart/form-data'
            }})
          .then(()=>{
            this.$store.state.basket.blocks.forEach((item, index)=>{
              if (item['owner']['id'] === block['owner']['id']) {
                this.$store.state.basket.blocks.splice(index, 1);
              }
            });})
          .catch((response)=>{if (response.response) {console.warn(response.response.data)}});
      }
    },
    mounted() {
      let head=document.getElementsByTagName('head')[0],
          picker_script = document.createElement('script'),
          picker_style = document.createElement('link');

      picker_script.setAttribute('src', "https://unpkg.com/element-ui/lib/index.js");
      //head.appendChild(picker_script);
      picker_style.rel = 'stylesheet';
      picker_style.type='text/css';
      picker_style.href="https://unpkg.com/element-ui/lib/theme-chalk/index.css";
      //head.appendChild(picker_style);

      //this.downloadBasket();
      axios
        .get(this.$store.state.host + "/csrf")
        .then((response)=>{this.$store.state.csrf = response.data; this.notLoaded = false;});
      this.$refs.siteHeader.downloadBasket();
    },
  }
</script>

<style lang="sass">
  html
    overflow-y: scroll
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
        padding: 10px 0 10px 0
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
        padding: 0 0 0 5px
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
    span
      position: absolute
      vertical-align: bottom
      line-height: 80px
      margin-left: 15px
      color: gray
  .commentaries
    overflow: hidden
    word-break: keep-all
    white-space: nowrap
    margin-top: 40px
    .placeholder
      position: absolute
      z-index: 1
      margin: 7px 0 0 5px
      color: gray
      pointer-events: none
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
      white-space: normal
      word-break: break-all
  .parameters
    width: 160px
    font-size: 0
    .parameter
      display: inline-block
      min-width: 80px
  .countAndCost
    .countInput
      width: 50px
      display: inline-block
      margin: 0 5px 0 10px
      box-sizing: border-box
      padding: 0 10px 0 10px
    p
      margin: 0
    .firstDay
      margin: 10px 0 10px 0
      span:first-child
        display: inline-block
        min-width: 250px
      span:nth-child(2)
        margin-right: 5px

    .otherDays
      margin: 10px 0 10px 0
      span:first-child
        display: inline-block
        min-width: 250px
      span:nth-child(2)
        margin-right: 5px
    .bail
      span:first-child
        display: inline-block
        min-width: 80px
      span:nth-child(2)
        margin-right: 5px

  .fade-enter-active, .fade-leave-active
    transition: opacity 0.3s
    transition-delay: 1.0s

  .fade-enter, .fade-leave-to
    opacity: 0

  .disabled
    pointer-events: none
    color: gray
    background: #F5F5F5
</style>
