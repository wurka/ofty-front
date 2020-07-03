<template>
  <div class="photo-and-color-picker-layout">
    <div class="title">
      Загрузите фотографию товара и выберите цвета (максимально 5 цветов)
    </div>
    <div class="photos">
      <div class="photo" v-for="i in 5" :key="'photo_' + i">
        <img src="http://dummyimage.com/155x155" :alt="'photo_'+i">
      </div>
    </div>
    <div class="color-error">
      Допустимо добавление не более 5 цветов
    </div>
    <div class="colors">
      <div class="group" id="group1">
        <div class="color"
             v-for="(color, ci) in $store.state.unit.colors.group1"
             :key="'group_1_color'+ci"
             :style="'background: #' + color['rgb_hex']">
          <div class="marker" v-show="color.checked">
            <img :src="$store.state.host + '/static/img/shared/black-flag.png'" alt="marker">
          </div>
        </div>
      </div>
      <div class="group" id="group2">
        <div class="color"
             v-for="(color, ci) in $store.state.unit.colors.group2"
             :key="'group_1_color'+ci"
             :style="'background: #' + color['rgb_hex']">
          <div class="marker" v-show="color.checked">
            <img :src="$store.state.host + '/static/img/shared/black-flag.png'" alt="marker">
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "PhotoAndColorPicker",
    data: function(){ return {
    }},
    mounted() {
      this.$store.dispatch('COLORS_GET');
    }
  }
</script>

<style scoped lang="sass">
  .photo-and-color-picker-layout
    font-family: Philosopher, serif
    .title
      margin: 35px auto 0 auto
      text-align: center
      font-size: 21px
      line-height: 24px
    .photos
      text-align: center
      .photo
        display: inline-block
        img
          width: 155px
          height: 155px
          margin: 50px 20px

    .group
      display: flex
      margin: 10px 64px
      .color
        display: block
        flex-grow: 1
        margin: 0 6px
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
      &#group1
        .color
          height: 71px


</style>
