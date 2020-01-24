<template>
  <div>
    <div class="bg" v-if="shown"></div>
    <div  :class="['AvatarPicker', shown?'':'hidden']">
      <div class="text">Выберите область, которая будет отображаться на Вашей странице и в сообщениях</div>
      <vue-cropper  ref="cropper"  :src="startImg"  alt="Source Image" class="cropper"
                    :crop="cropIt"
                    :background="false" :modal="true" :toggleDragModeOnDblclick="false"
                    :minCanvasHeight="400" :minCropBoxHeight="70" :autoCropArea="0.8"
                    :cropBoxMovable="true" :highlight="false" :guides="false" :center="false" :cropBoxResizable="true"
                    :aspectRatio="1" :viewMode="1" dragMode="move">
      </vue-cropper>
      <div class="pre">
        <img :src="cropImage" class="big"/>
        <img :src="cropImage" class="small"/>
        <img :src="host+'/static/img/shared/whiteRing.png'" class="smallRing"/>
      </div>
      <input class='hidden' type="file" ref="img"  @input="updateImg">
      <div class="btn b1" @click="pickAvatar">Сохранить</div>
      <div class="btn b2" @click="hidePicker">Отмена</div>

    </div>
  </div>

</template>

<script>
  import VueCropper from 'vue-cropperjs';
  import 'cropperjs/dist/cropper.css';

  export default {
    name: "AvatarPicker",
    props:['startImg'],
    components: {VueCropper},
    data: function () {
      return{
        shown:false,
        scrollDisabled:false,
        cropImage:'',
        cropOptions:{viewMode:1},
        host:this.$store.state.host,
      }
    },
    methods:{
      test:function(){
        this.cropIt();
        console.log(this.$refs.cropper.getData());
      },
      showPicker:function(){
        this.shown = true;
        document.body.className='scrollDisable';
      },
      hidePicker:function(){
        this.shown = false;
        document.body.className='';
        this.$refs.img.value='';
      },
      cropIt:function () {
        //console.warn('CROP');
        this.cropImage = this.$refs.cropper.getCroppedCanvas().toDataURL();
        //this.resizeImgs();
      },
      updateImg :function(event){
        console.log('upd');
        var vm = this;
        var input = event.target;

        if (input.files&&input.files[0]){
          //console.log(input.files);
          var reader = new FileReader();
          reader.onloadend = function (e) {
            vm.$refs.cropper.replace(e.target.result);
          }
          //console.log(reader);
          //console.log(reader.result);
          reader.readAsDataURL(input.files[0]);
          //
          vm.showPicker();
        }
      },
      pickAvatar: function () {
        this.$emit('pickAvatar',this.cropImage);
        //this.shown = false;
      }
    },
    created:function(){
      //this.$refs.cropper.replace(this.props.startImg);
      //console.log(this.$refs.cropper);
      //this.$refs.img.click();
    },
    watch:{

    },
    computed:{
    },
  }
</script>

<style lang="sass" scoped>
  $lgray: #f6f6f6
  $myblue: #182b93
  $myred: #CA1612
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  .bg
    background-color: darkgray
    opacity: 0.3
    position: fixed
    left: 0
    top: 0
    height: 100vh
    width: 100vw
    z-index: 0
  .AvatarPicker
    width: 750px
    height: 780px
    background-color: white
    box-shadow: $shadow
    position: absolute
    left: 440px
    top: 100px
    z-index: 1
    .text
      font-size: 15.5px
      font-family: Tahoma
      margin: 45px 0 0 65px
    .cropper
      margin: 30px 0 0 60px
      width: 425px
      height: 550px
      border: black solid thin
      overflow: hidden
      display: inline-block
    .pre
      display: inline-block
      vertical-align: top
      margin: 30px 0 0 10px
      .big
        width: 170px
        height: 170px
        display: block
      .small
        margin-top: 30px
        width: 71px
        height: 71px
        display: inline-block
      .smallRing
        margin-left: -76px
        width: 71px
        height: 71px
        display: inline-block

    .btn
      text-align: center
      display: inline-block
      padding: 8px 5px 8px 10px
      width: 155px
      font-family: Philosopher
    .b1
      margin: 35px 0 0 170px
    .b2
      margin: 35px 0 0 60px

</style>
