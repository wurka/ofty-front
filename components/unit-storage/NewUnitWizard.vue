<template>
  <div class="layout" v-if="shown">
    <div class="steps">
      <div class="step" v-for="i in 4" :key="'step_' + i"
        :class="{'selected': step === i}"
        @click="goStep(i)">{{i}}
      </div>
    </div>
    <div class="step-1" v-if="step === 1">
      <CategoryPicker/>
    </div>
    <div class="buttons">
      <input type="button" class="button" value="Отмена" @click="emitHide">
      <input type="button" class="button" value="Подтвердить">
    </div>
  </div>
</template>

<script>
  import CategoryPicker from "./CategoryPicker";
  export default {
    name: "NewUnitWizard",
    components: {CategoryPicker},
    data: function () {
      return {
        shown: true,
        step: 1,
      }
    },
    methods: {
      show : function(params){
        this.shown=true;
        if (params){
          this.editParams = params;
          this.fillParams();
        }
        this.$emit('scrollDisable');
        document.body.className='scrollDisable';
      },
      goStep(step_number) {
        this.step = step_number;
      },
      emitHide() {
        this.$emit('hide-add-decor');
      }
    }
  }
</script>

<style scoped lang="sass">
  .layout
    position: absolute
    width: 1080px
    margin: -60px 0 0 -170px
    background: white
    z-index: 10
    border: 1px solid #C4C4C4
    min-height: 400px
  .steps
    text-align: center
    line-height: 10px
    padding: 0
    margin: 23px 0
    .step
      vertical-align: middle
      display: inline-block
      width: 14px
      height: 14px
      box-sizing: border-box
      border: 1px solid #C4C4C4
      border-radius: 7px
      font-size: 0
      margin: 0 10px
      &.selected
        background: #C4C4C4
      &:hover
        border: 1px solid black
        cursor: pointer
      &:active
        background: black
  .buttons
    text-align: center
    margin: 40px 0 50px 0
    .button
      display: inline-block
      background: white
      padding: 10px 0
      min-width: 160px
      margin: 0 16px
      user-select: none
      outline: none
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
      &:hover
        background: #e4e4e4
      &:active
        outline: none
        background: #C4C4C4



</style>
