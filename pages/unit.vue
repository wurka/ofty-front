<template>
  <div class="layout">
    <SiteHeader/>
    <div class="content">
      <transition name="fade">
        <div class="loading" v-if="loadingScreen">
          loading ... {{ $route.query.id}}
          <img :src="$store.state.host+'/static/img/shared/timer.svg'" alt="s">
        </div>
      </transition>
      <transition name="fade">
        <div class="info" v-if="infoScreen">
          {{$store.getters.UNIT_VIEW}}
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
    mounted() {
      let vm = this;
      this.$store.dispatch('UNIT_GET', vm.$route.query.id).then(()=>{
        setTimeout(()=>{vm.loadingScreen = false}, 0/*1500*/);
        setTimeout(()=>{vm.infoScreen = true}, 0/*2000*/);
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
    img
      width: 424px
      height: 424px
  .smallPhotos
    font-size: 0
    img
      display: inline-block
      width: 100px
      height: 100px
      &:not(:first-child)
        margin: 10px 0 0 8px


</style>
