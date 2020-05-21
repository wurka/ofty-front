<template>
    <div class="layout">
      <div class="title">Выберите категорию товара</div>
      <div class="pictures">
        <div class="loading circle" v-if="loading">
          <img src="http://zlaksa.ru/static/img/shared/pencil.gif" alt="loading">
        </div>
        <div class="group" v-for="(group, index) in groups" v-bind:key="'group_'+index">
          <img :src="group['group-image']" alt="group">
          <div class="name">{{group.name}}</div>
        </div>
      </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
      name: "category-picker",
      data: function() {
        return {
          loading: true,
          groups: []
        }
      },
      mounted() {
        axios
        .get(this.$store.state.host + '/units/get-groups')
        .then((result)=> {
          this.loading = false;
          console.log(result.data);
          this.groups = result.data;
        })
      }
    }
</script>

<style scoped lang="sass">
  .layout
    width: 800px
    background: white
    font-family: Philosopher,serif
    font-size: 24px
    margin: 50px auto 0 auto
  .title
    text-align: center
    padding: 30px 0 0 0
  .circle
    border-radius: 50%
    display: inline-block
    position: relative
    text-align: center
  .circle img
    border-radius: 50%
    display: inline-block
    border: 1px solid #fff
    margin: auto
  .circle:after
    content: ""
    display: block
    width: 100%
    height: 100%
    background: radial-gradient(ellipse at center, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 70%,rgba(255,255,255,1) 100%)
    border-radius: 50%
    position: absolute
    top: 0
    left: 0
  .group
    display: inline-block
    width: 145px
    overflow: hidden
    font-size: 18px
    margin: 20px
    .name
      text-align: center
</style>
