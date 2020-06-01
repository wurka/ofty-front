<template>
    <div class="layout">
      <div class="title">Выберите категорию товара</div>
      <div class="navigator">
        <div class="navigator-element" @click="goRoot"> > все товары</div>
        <div class="navigator-element" v-for="(ng, index) in navigatorGroups"
             :key="'ng_' + index"
             @click="goBackGroup(ng)">
          > {{ng.name}}
        </div>
      </div>
      <div class="pictures">
        <div class="loading circle" v-if="loading">
          <img src="http://zlaksa.ru/static/img/shared/pencil.gif" alt="loading">
        </div>
        <div class="parent-group" v-if="parentGroup !== ''">
          <div class="line">
            <div class="img-container">
              <img :src="parentGroupImg" alt="parent img">
            </div>
            <span>{{parentGroup}}</span>
          </div>

        </div>
        <div class="groups">
          <div class="group" v-for="(group, index) in groups" v-bind:key="'group_'+index"
            @click="goNextGroup(group)">
            <div class="img-container">
              <img :src="group['group-image']" alt="group">
            </div>
            <div class="name">{{group.name}}</div>
          </div>
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
          groups: [],
          parentGroupId: 0,
          parentGroup: "",
          parentGroupImg: 'https://dummyimage.com/155x155.png',
          navigatorGroups: [],
        }
      },
      mounted() {
        let url = this.$store.state.host + '/units/get-groups';
        console.log(url);
        axios
        .get(url)
        .then((result)=> {
          this.loading = false;
          console.log(result.data);
          this.groups = result.data;
        })
      },
      methods: {
        loadGroups() {
          let url = this.$store.state.host + '/units/get-groups',
            config = {};

          if (this.parentGroupId !== 0) {
            config = {
              params: {'parentid': this.parentGroupId}
            }
          }

          axios
            .get(url, config)
            .then((result)=> {
              this.loading = false;
              console.log(result.data);
              this.groups = result.data;
            })
        },
        setParent(group) {
          let name = group.name,
            image = group['group-image'],
            group_id = group.id;
          this.parentGroup = name;
          this.parentGroupImg = image;
          this.parentGroupId = group_id;
          this.loadGroups();
        },
        goRoot() {
          this.parentGroup = "";
          this.parentGroupImg = "";
          this.parentGroupId = 0;
          this.navigatorGroups = [];
          this.loadGroups();
        },
        goNextGroup(group) {
          // перейти на следующую в дереве группу
          this.navigatorGroups.push(group);
          this.setParent(group);
          this.loadGroups();
        },
        goBackGroup(group) {
          // откатиться до указанной группы в дереве
          let newLength = 0;
          this.navigatorGroups.forEach((g, index)=>{
            if (g.id === group.id) {
              newLength = index + 1;
            }
          });
          this.navigatorGroups.splice(newLength);
          this.setParent(group);
        }
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
  .parent-group
    text-align: center
    padding: 0 0 0 50px
    display: none
    span
      background: pink
      line-height: 135px
      display: inline-block
      vertical-align: top
    .img-container
      width: 135px
      display: inline-block
    img
      line-height: 135px
      vertical-align: bottom

  .groups
    display: grid
    grid-template-columns: repeat(3, 1fr)
    grid-gap: 10px
    padding: 10px
    user-select: none
  .group
    text-align: center
    font-size: 18px
    border: 1px solid white
    padding: 0 0 15px 0
    &:hover
      border: 1px solid gray
    &:active
      transform: scale(1.1)
    .name
      text-align: center
      animation-name: fade-out
      animation-duration: 0.3s
      animation-delay: 0.3s
      opacity: 0
      animation-fill-mode: forwards
    .img-container
      animation-name: intro-container
      animation-duration: 0.3s
      display: inline-block
      overflow: hidden
      line-height: 145px
      img
        vertical-align: middle

  .navigator
    padding: 0 0 0 30px
    .navigator-element
      display: inline-block
      cursor: default
      user-select: none
      font-size: 18px
      color: gray
      &:hover
        text-decoration: underline

  @keyframes fade-out
    from
      opacity: 0.0
    to
      opacity: 1.0
  @keyframes intro-container
    from
      width: 0
      height: 0
      line-height: 0
    60%
      width: 175px
      height: 175px
      line-height: 175px
    to
      width: 145px
      height: 145px
      line-height: 145px
</style>
