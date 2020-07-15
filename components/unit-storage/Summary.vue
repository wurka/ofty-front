<template>
  <div class="summary-layout">
    <div class="not-ready" v-show="!validated">
      Заполните информацию о товаре на предыдущих шагах
    </div>
    <div class="ready" v-show="validated">
      <div class="title">Информация о новом товаре</div>
      <div class="unit-type">
        <div class="flex">
          <div class="size-image">
            <img :src="typeImage" alt="size img">
          </div>
          <div class="type-and-parameters">
            <div class="type">
              <span>Группа: </span>
              <div class="group" v-for="(group, gi) in groups" :key="'group_'+gi">
                <div class="separator">/</div>
                <div>{{group}}</div>
              </div>
            </div>
            <div class="parameters">
              <div class="parameter" v-for="(parameter, pi) in parameters" :key="'param_'+pi">
                {{ parameter.name }} = {{ parameter.value }}, {{ parameter.dimension }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="photos">
        <div class="photo" v-for="(photo, pi) in photos" :key="'photo_'+pi">
          <img :src="photo" :alt="'photo#' + pi">
        </div>
      </div>
      <div class="colors">
        <div class="color" v-for="(color, ci) in colors" :key="'color_'+ci">
          <div class="simple-color"
               v-if="color['rgb _hex'] !== ''"
               :style="'background: #' + color['rgb_hex']" />
          <div class="texture-color"
               v-if="color['texture'] !== ''"
               :style="'background: url('+color['texture']+')'"/>
        </div>
      </div>
      <div class="costs">costs</div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "Summary",
      data: function () { return {
        typeImage: this.$store.state.host + "/static/img/shared/no_img.png",
        groups: [],
        parameters: [],
        groupId: [],
        photos: [],
        colors: [],
        costs: [],
      }},
      computed: {
        validated() {
          return (
            (this.groups.length > 0) &&
            (this.photos.length > 0) &&
            (this.colors.length > 0) &&
            (this.costs.length > 0)
          )
        }
      }
    }
</script>

<style scoped lang="sass">
  .summary-layout
    font-family: Philosopher, serif
    font-size: 18px
    .not-ready
      font-size: 21px
      text-align: center
      margin: 150px 0 150px 0
    .flex
      display: flex
    .title
      text-align: center
      font-size: 22px
    .unit-type
      width: 500px
      margin: 30px auto 0 auto
      .type-and-parameters
        .group
          display: inline
          div
            display: inline
        .group:nth-child(2)
          .separator
            display: none
    .photos
      text-align: center
      margin: 30px 0 0 0
      .photo
        display: inline-block
        margin: 0 10px 0 0
        &:last-child
          margin: 0
        img
          width: 155px
          height: 155px
          border: 1px solid white
    .colors
      text-align: center
      .color
        display: inline-block
        margin: 0 10px 0 0
        &:last-child
          margin: 0
      .simple-color, .texture-color
        height: 30px
        width: 155px
        border: 1px solid black


</style>
