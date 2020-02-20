<template>
  <div class="layout">
    <SiteHeader/>
    <div class="content">
      <transition name="fade">
        <div class="loading" v-if="loadingScreen">
          <img :src="$store.state.host+'/static/img/shared/timer.svg'" alt="s">
        </div>
      </transition>
      <transition name="fade">
        <div class="info" v-if="infoScreen">
          <!--v-if="getOwner(unit)['phone'] !== ''"-->
          <div class="flex">
            <div class="images">
              <div class="bigPhoto">
                <img :src="unit.photo1" alt="photo1">
              </div>
              <div class="smallPhotos">
                <img :src="unit.photo2" alt="photo2" v-if="unit.photo2">
                <img :src="unit.photo3" alt="photo3" v-if="unit.photo3">
                <img :src="unit.photo4" alt="photo4" v-if="unit.photo4">
                <img :src="unit.photo5" alt="photo5" v-if="unit.photo5">
              </div>

            </div>
            <div class="right">
              <div class="title-and-params-and-image">
                <div class="title-and-params">
                  <div class="title t1-2">{{unit['title']}}</div>
                  <div class="category t1-5">
                    <span v-for="(g, index) in getGroups(unit)" :key="'g#'+index">/{{g}}</span>
                  </div>
                  <div class="params">
                    <div class="param t1-5" v-for="up in getParams(unit)" :key="'up#'+up.id">
                      {{up.name}}={{up.value}} {{up.dimension}}
                    </div>
                  </div>
                </div>
                <div class="category-image">
                  <img :src="getGroupImage(unit)" alt="category-image">
                </div>
              </div>
              <div class="material t1-5">
                <span class="t1-5 line">Материал: {{getMaterials(unit)}}</span>
              </div>
              <div class="color line">
                <span class="t1-5">Цвет:</span>
                <span v-for="color in unit['unit-colors']"
                      :key="'unit#'+unit.id+'_color#'+color.id"
                      :style="getColorStyle(color)"
                      class="unit-color"
                > </span>
              </div>
              <div class="weight line t1-5">Вес: {{unit['weight']}}</div>
              <div class="line t1-5">Количество: {{unit['count']}}</div>
              <div class="line t1-5">Мин. срок аренды: {{unit['count']}}</div>
              <div class="line t1-5">Стоимость первого дня: {{unit['count']}}</div>
              <div class="line t1-5">Стоимость последующих дней: {{unit['count']}}</div>
              <div class="line bail t1-5">Залог: {{unit['count']}}</div>
              <div class="keywords line t1-5">Ключевые слова:
                <span v-for="(kw, kwi) in unit['keywords']" :key="'unit'+unit.id+'keyword'+kwi">#{{kw}} </span>
              </div>
              <div class="line t1-5 toRight">Комментарий: {{unit['description']}}</div>
              <div class="line t1-5 toRight">Компания: {{getOwner(unit)['company-name']}}</div>
              <div class="line t1-5 toRight" v-if="getOwner(unit)['phone'] !== ''">Телефон: {{getOwner(unit)['phone']}}</div>
              <div class="line t1-5 toRight" v-if="getOwner(unit)['sklad'] !== ''">Адрес склада: {{getOwner(unit)['sklad']}}</div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import SiteHeader from "~/components/shared/SiteHeader";
  export default {
    name: "unit",
    components: {SiteHeader},
    data() { return {
      loadingScreen: true,
      infoScreen: false,
    }},
    methods: {
      getGroups(unit) {
        let gi = unit['group-info'];
        if (gi) {
          if (gi['groups']) {
            return JSON.parse(gi['groups']);
          }
        }
        return [];
      },
      getParams(unit) {
        let gi = unit['group-info'];
        if (gi) {
          if (gi['params']) {
            return gi['params'];
          }
        }
        return [];
      },
      getOwner(unit) {
        let empty = {
          'id': '-',
          'company-name': '-',
          'phone': '-',
          'phone2': '-',
          'sklad': '-'
        };
        if (unit) {
          if (unit['owner']) {
            return unit['owner'];
          }
        }
        return empty;
      },
      getGroupImage(unit) {
        let gi = unit['group-info'];
        if (gi) {
          if (gi['group-image']) {
            return gi['group-image'];
          }
        }
        return "http://dummyimage.com/145x145.png"
      },
      getMaterials(unit) {
        let um = unit['unit-materials'],
          ans = "";
        if (um) {
          um.forEach((item)=>{ans += item.name + ", "});
        }
        return ans.slice(0, -2);
      },
      getColorStyle(unitColor){
        let ans = "background: ";

        if (unitColor['texture']) {
          ans += "url("+unitColor['texture']+");";
        } else {  // нет текстуры
          ans += "#"+unitColor['rgb_hex']+ ";";
        }
        return ans;
      }
    },
    mounted() {
      let vm = this;
      this.$store.dispatch('UNIT_GET', vm.$route.query.id).then(()=>{
        setTimeout(()=>{vm.loadingScreen = false}, 500);
        setTimeout(()=>{vm.infoScreen = true}, 1000);
      })
    },
    computed: {
      unit(){
        return this.$store.getters.UNIT_VIEW;
      }
    }
  }
</script>

<style scoped lang="sass">
  .fade-enter-active, .fade-leave-active
    transition: opacity 0.5s
  .fade-enter, .fade-leave-to
    opacity: 0
  .flex
    display: flex
  .layout
    width: 1140px
    margin: auto
    min-height: 100vh
    background: white
    display: flex
    flex-direction: column
  .content
    background: white
    //flex-grow: 1
    display: flex
    flex-direction: row
    .loading
      background: white
      flex-grow: 1
      img
        display: block
        margin: 150px auto
    .info
      width: 1102px
      background: #f6f6f6
      display: block
      margin: auto
  .bigPhoto
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
    img
      width: 424px
      height: 424px
  .smallPhotos
    font-size: 0
    img
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
      display: inline-block
      width: 100px
      height: 100px
      &:not(:first-child)
        margin: 10px 0 0 8px
  .right
    flex-grow: 1
    padding: 0 0 0 24px
    .line
      margin: 0 0 12px 0
    .toRight
      text-align: right
    .bail
      margin: 0 0 30px 0
  .title-and-params-and-image
    display: flex
    .title
      margin: 0 0 7px 0
    .title-and-params
      flex-grow: 1
      .category
        color: gray
        margin: 0 0 20px 0
    .param
      display: inline-block
      min-width: 160px
      box-sizing: border-box
    .category-image
      padding: 0
      img
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
        width: 145px
        height: 145px
        box-sizing: border-box
  .unit-color
    display: inline-block
    width: 47px
    height: 17px
    border: 1px solid #c4c4c4
    box-sizing: border-box
    margin: 0 5px 0 5px
  .info
    padding: 30px
</style>
