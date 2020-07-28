<template>
  <div class="photo-and-color-picker-layout" v-if="shown">
    <div class="loading" v-if="loading">
      Обработка изображения
    </div>
    <div class="title" v-if="$props.usePhotoSelector">
      Загрузите фотографию товара и выберите цвета (максимально 5 цветов)
    </div>
    <div class="title" v-else>
      Выберите до 5 цветов
    </div>
    <div class="photos" v-if="$props.usePhotoSelector">
      <div class="photo" v-for="(im, i) in images" :key="'photo_' + i">
        <img :src="$store.state.host+'/static/img/shared/minus.png'" alt="x" class="clear-me"
             v-if="im !== defaultImage"
             title="Удалить эту фотографию"
             @click="clearImage(i)">
        <img :src="im" :alt="'photo_'+i" @click="clickPhotoInput(i)" class="photo-img">
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

    <div class="color-error" :class="{transparent: selectedColors.length <= 5}">
      Допустимо добавление не более 5 цветов
      {{selectedColors}}
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
      <div class="buttons" v-if="showButtons">
        <input type="button" value="OK" @click="closeMe()">
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
    props: {
      shown: {type: Boolean, default: true},
      usePhotoSelector: {type: Boolean, default: true},
      showButtons: {type: Boolean, default: false},
    },
    data: function(){ return {
      loading: false,
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
      selectedColors: [],
      demoColors: [],
    }},
    mounted() {
      this.$store.dispatch('COLORS_GET');
    },
    computed: {
      atLeastOnePhoto() {
        let ans = false;
        for (let image of this.images) {
          if (image !== this.defaultImage) {
            ans = true; break;
          }
        }
        return ans;
      },
      validated() {
        return (this.selectedColors.length <= 5) &&
          (this.selectedColors.length > 0) &&
          (this.atLeastOnePhoto)
      }
    },
    methods: {
      closeMe() {
        console.log(this.demoColors);
        this.$emit('colorsSelected', this.demoColors);
      },
      acceptCropper() {
        // cropper должен сработать
        this.cropperShown = false;
        this.$set(this.images, this.imageIndex, this.$refs.cropper.getCroppedCanvas().toDataURL());

        // это для того, чтобы можно работало повторное открытие файла
        document.getElementById('photo_input_' + this.imageIndex).value = '';

        this.$emit('validatedChanged');
      },
      closeCropper() {
        // отменить кроппер (спрятать и не резать)
        this.cropperShown = false;
        // это для того, чтобы можно работало повторное открытие файла
        document.getElementById('photo_input_' + this.imageIndex).value = '';

        this.$emit('validatedChanged');
      },
      setColorsById(colorIds) {
        // установить свойство checked в тех цветах, которые указаны (id) в аргументе
        this.$store.commit('COLORS_SELECT_BY_IDS', colorIds);
        this.$set(this.selectedColors, []);

        [
          this.$store.state.unit.colors.group1,
          this.$store.state.unit.colors.group2,
          this.$store.state.unit.colors.group3,
          this.$store.state.unit.colors.group4,
          this.$store.state.unit.colors.group5,
        ].forEach((group)=>{
          group.forEach((color)=>{
            if (color.checked === true) {
              this.selectedColors.push(color.id);
              this.demoColors.push(color);
            }
          })
        });

      },
      inverseColorSelection (color) {
        this.$store.dispatch('COLORS_INVERSE_CHECKED', color);

        if (color.checked === true) {
          if (!this.selectedColors.includes(color.id)) {
            this.selectedColors.push(color.id);
            this.demoColors.push(color);
          }
        } else {
          if (this.selectedColors.includes(color.id)) {
            this.selectedColors = this.selectedColors.filter((x)=>{return x!== color.id });
            this.demoColors = this.demoColors.filter((x)=>{return x.id!== color.id });
          }
        }

        this.$emit('validatedChanged');
      },
      clearImage(imageIndex) {
        this.$set(this.images, imageIndex, this.defaultImage);

        this.$emit('validatedChanged');
      },
      clickPhotoInput(number) {
        window.document.getElementById('photo_input_'+number).click();
      },
      sendToCropper(event, imageIndex) {
        this.loading = true;
        this.imageIndex = imageIndex;
        this.cropperShown = false;

        // долгие расчёты - на следующий кадр
        window.requestAnimationFrame(()=>{
          let input = event.target,
            vm = this;
          if (input.files&&input.files[0]) {
            let reader = new FileReader();
            reader.onloadend = function (e) {
              let src = e.target.result,
                img = new Image(),
                canvas = document.createElement('canvas');
              img.onload = ()=>{
                const width=img.naturalWidth,
                  height=img.naturalHeight,
                  square=Math.max(width, height);
                if ((height < 300) || (width < 300)) {
                  console.log(height, width);
                  vm.cropperShown = false;
                  vm.loading = false;
                  alert('Изображение должно быть не меньше 300х300 пикселей.');
                  return;
                }
                canvas.width=square;
                canvas.height=square;

                let ctx = canvas.getContext('2d');
                ctx.drawImage(
                  img, (square-width)/2,
                  (square-height)/2, width, height);

                const data = ctx.canvas.toDataURL(img, 1.0);

                //vm.$refs.cropper.replace(src);
                vm.$refs.cropper.replace(data);
                vm.loading = false;
              }
              img.src = src;
            }
            reader.readAsDataURL(input.files[0]);
            this.cropperShown = true;
          }
        });


      }
    }
  }
</script>

<style lang="sass">
  .cropper-crop-box
    overflow: hidden
</style>

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
      user-select: none
      .clear-me
        width: 24px
        height: 24px
        position: absolute
        background: white
        margin: 55px 0 0 140px
        border: 1px solid gray
        box-shadow: none
        display: none
        &:hover
          background: #F5F5F5
          border: 1px solid black
      .photo
        display: inline-block
        cursor: pointer
        &:hover
          .clear-me
            display: block
        .photo-img
          width: 155px
          height: 155px
          margin: 50px 20px 20px 20px
          border: 1px solid transparent
          box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
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
  .buttons
    text-align: center
    margin: 20px
    input
      background: white
      border: 1px solid gray
      padding: 5px 30px
      font-family: Tahoma, serif
  .color-error
    text-align: center
    color: red
    user-select: none

  .transparent
    opacity: 0

  .loading
    position: fixed
    background: rgba(255, 255, 255, 0.8)
    font-family: Philosopher, serif
    font-size: 38px
    text-align: center
    width: 100vw
    height: 100vh
    top: 0
    left: 0
    padding: 300px 0 0 0

</style>
