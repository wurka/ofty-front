<template>
  <div class="photo-and-color-picker-layout">
    <div class="title">
      Загрузите фотографию товара и выберите цвета (максимально 5 цветов)
    </div>
    <div class="photos">
      <div class="photo" v-for="(im, i) in images" :key="'photo_' + i">
        <img :src="im" :alt="'photo_'+i" @click="clickPhotoInput(i)">
        <input type="file" :name="'photo'+i" :id="'photo_input_' + i"
               @input="sendToCropper($event, i)">
      </div>
    </div>
    <div class="cropper-place" v-if="cropperShown">
      <div class="image">
        <VueCropper ref="cropper"  alt="Source Image" class="cropper"
                    :background="false" :modal="true" :toggleDragModeOnDblclick="false"
                    :minCanvasHeight="400" :minCropBoxHeight="70" :autoCropArea="0.8"
                    :cropBoxMovable="true" :highlight="false" :guides="false" :center="false" :cropBoxResizable="true"
                    :aspectRatio="1" :viewMode="1" dragMode="move"/>
      </div>
      <div class="buttons">
        <input type="button" value="OK" @click="acceptCropper">
        <input type="button" value="Отмена" @click="closeCropper">
      </div>

    </div>

    <div class="color-error">
      Допустимо добавление не более 5 цветов
    </div>
    <div class="colors">
      <div class="group" :id="'group'+i_group" v-for="i_group in 5" :key="'group#' + i_group">
        <div class="color"
             @click="inverseColorSelection(color)"
             v-if="i_group > 3"
             v-for="(color, ci) in $store.state.unit.colors['group' + i_group]"
             :key="'group_1_color'+ci"
             :style="'background: url(' + color['texture'] + ')'">
          <div class="marker" v-show="color.checked">
            <img :src="$store.state.host + '/static/img/shared/v.svg'" alt="marker">
          </div>
        </div>
        <div class="color"
             @click="inverseColorSelection(color)"
             v-if="i_group <= 3"
             v-for="(color, ci) in $store.state.unit.colors['group' + i_group]"
             :key="'group_1_color'+ci"
             :style="'background: #' + color['rgb_hex']">
          <div class="marker" v-show="color.checked">
            <img :src="$store.state.host + '/static/img/shared/v.svg'" alt="marker">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import VueCropper from 'vue-cropperjs';
  import 'cropperjs/dist/cropper.css';

  export default {
    name: "PhotoAndColorPicker",
    components: {VueCropper},
    data: function(){ return {
      cropperShown: false,
      imageIndex: 0,
      defaultImage: this.$store.state.host + "/static/img/shared/no_img.png",
      images: [
        this.$store.state.host + "/static/img/shared/no_img.png",
        this.$store.state.host + "/static/img/shared/no_img.png",
        this.$store.state.host + "/static/img/shared/no_img.png",
        this.$store.state.host + "/static/img/shared/no_img.png",
        this.$store.state.host + "/static/img/shared/no_img.png",
      ],
    }},
    mounted() {
      this.$store.dispatch('COLORS_GET');
    },
    methods: {
      acceptCropper() {
        // cropper должен сработать
        this.cropperShown = false;
        this.images[this.imageIndex] = this.$refs.cropper.getCroppedCanvas().toDataURL();
        // это для того, чтобы можно работало повторное открытие файла
        document.getElementById('photo_input_' + this.imageIndex).value = '';
      },
      closeCropper() {
        // отменить кроппер (спрятать и не резать)
        this.cropperShown = false;
        // это для того, чтобы можно работало повторное открытие файла
        document.getElementById('photo_input_' + this.imageIndex).value = '';
      },
      inverseColorSelection (color) {
        this.$store.dispatch('COLORS_INVERSE_CHECKED', color);
      },
      clickPhotoInput(number) {
        window.document.getElementById('photo_input_'+number).click();
      },
      sendToCropper(event, imageIndex) {
        this.imageIndex = imageIndex;
        this.cropperShown = false;

        let input = event.target,
          vm = this;
        if (input.files&&input.files[0]) {
          let reader = new FileReader();
          reader.onloadend = function (e) {
            vm.$refs.cropper.replace(e.target.result);
          }
          reader.readAsDataURL(input.files[0]);
          this.cropperShown = true;
        }
      }
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
        cursor: pointer
        img
          width: 155px
          height: 155px
          margin: 50px 20px
          border: 1px solid transparent
          &:hover
            border: 1px solid gray
            background: #F5F5F5
      input[type=file]
        display: none


    .group
      display: flex
      margin: 10px 64px
      .color
        display: block
        flex-grow: 1
        margin: 0 6px
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
        user-select: none
        .marker
          position: absolute
          text-align: right
      &#group1, &#group2
        .color
          height: 71px
      &#group3
        .color
          height: 35px
      &#group4, &#group5
        .color
          height: 103px
  .cropper-place
    width: 100vw
    height: 100vh
    top: 0
    left: 0
    background-color: rgba(0, 0, 0, 0.5)
    position: fixed
    text-align: center
    .image
      width: 400px
      max-height: calc(100vh - 120px)
      overflow-x: hidden
      overflow-y: auto
      margin-top: 100px
      display: inline-block
    .buttons
      display: inline-block
      vertical-align: top
      margin-top: 100px
      input
        background: white
        border: 1px solid gray
        margin: 0 0 10px 0
        padding: 5px
        min-width: 100px
        display: block

</style>
