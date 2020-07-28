<!-- Этот элемент предназначен для выбора нескольких вариантов из источника
источник - массив js объектов {id: x, name: y}. name используется для
отображения при выборе
-->
<template>
  <div class="picker-layout">
    <div class="input">
      <div class="empty" v-show="selectedVariants.length===0"
           @click="activateSearchMode">
        выберите материал
      </div>
      <div class="selected-variants" v-show="!(selectedVariants.length===0)">
        <div class="selected-variant variant" v-for="(variant, vi) in selectedVariants"
             v-bind:key="'selectedVariant_' + vi">
          {{ variant.name }}
          <div class="times"
               @click="removeVariantFromSelected(variant)">
            &times;
          </div>
        </div>
        <div class="add-variant" @click="activateSearchMode"
             v-show="selectedVariants.length<5"
        >добавить</div>
      </div>
    </div>
    <div class="search" v-show="searchMode">
      <input type="text"
             placeholder="поиск.."
             ref="searchInput"
             @input="updateVariants">
      <div class="variants shown-variants" v-show="searchMode">
        <div class="variant" v-for="(variant, vi) in shownVariants"
             v-bind:key="'variant_'+vi"
             @click="addVariant2Selected(variant)"
             :class="{disabled: variant.selected}"
        >
          {{ variant.name }}
        </div>
      </div>
      <div class="buttons">
        <div class="button"
             @click="deactivateSearchMode"
        >Отмена</div>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "Picker",
    data: function() { return {
      variants: [],
      shownVariants: [],
      selectedVariants: [],
      searchMode: false,
    }},
    computed: {
      isValid() {
        return this.selectedVariants.length > 0;
      }
    },
    mounted() {
      let vm = this;
      axios
        .get(this.$store.state.host + '/units/materials-source')
        .then((response)=>{
          let loaded = response.data;
          loaded.forEach((item)=>{item.selected=false;});
          vm.variants = loaded;
        })
        .catch((response)=>{
          console.error('get materials error');
          console.log(response);
        })
    },
    methods: {
      activateSearchMode() {
        let input = this.$refs.searchInput;
        this.searchMode = true;
        input.value = "";
        this.updateVariants();

        window.requestAnimationFrame(()=>{
          input.focus();
        });

      },
      deactivateSearchMode() {
        this.searchMode = false
      },
      addVariant2Selected(variant){
        variant.selected = true;
        this.selectedVariants.push(variant);
        this.deactivateSearchMode();
        this.$emit('valueChanged');
      },
      removeVariantFromSelected(variant) {
        for (let i=0; i<this.selectedVariants.length; i++) {
          if (this.selectedVariants[i].id === variant.id) {
            this.selectedVariants.splice(i, 1);
          }
        }
        // убрать флаг "выбран"
        for (let i=0; i<this.variants.length; i++) {
          if (this.variants[i].id === variant.id) {
            this.variants[i].selected = false;
          }
        }
        this.$emit('valueChanged');
      },
      updateVariants() {
        let text = this.$refs.searchInput.value.toLowerCase();
        this.shownVariants = this.variants.filter((v)=>{
          return v.name.includes(text)
        });
      }
    }
  }
</script>

<style scoped lang="sass">
  .picker-layout
    width: 250px
    font-family: Philosopher, serif
    box-sizing: border-box
    input
      display: block
      width: calc(100% - 15px)
      padding: 3px 7px
    .input
      border: 1px solid lightgray
      font-family: Philosopher, serif
      font-size: 24px
      //padding: 3px 7px
      box-sizing: border-box
    .search
      position: absolute
      background: white
      width: 600px
      border: 1px solid #000
      margin: 5px 0 0 -400px
      padding: 10px
    .variants
      .variant
        padding: 5px 7px
    .variant
      color: #646464
      display: inline-block
      background: #F6F6F6
      border-radius: 5px
      padding: 5px 0 5px 7px
      margin: 3px 6px 3px 0
      cursor: pointer
      border: 1px solid transparent
      user-select: none
      &.disabled
        opacity: 0.5
        pointer-events: none
        cursor: not-allowed
      &:hover
        color: black
        border: 1px solid black
      &:active
        background: lightskyblue
      .times
        display: inline-block
        width: 20px
        text-align: center
        opacity: 0
        &:hover
          font-weight: bold
          transform: scale(1.2)
      &:hover
        .times
          opacity: 1
    .selected-variants
      padding: 0 0 0 10px
      .variant
        background: white
        font-size: 18px
        padding: 0
        margin: 0 5px 0 0
        &:hover
          border: 1px solid transparent
    .add-variant
      color: gray
      display: inline-block
      font-size: 18px
      text-decoration: underline
      cursor: pointer
  .empty
    font-size: 18px
    padding: 3px 7px
    color: gray
  .shown-variants
    max-height: 400px
    overflow-y: scroll
  .buttons
    text-align: right
    .button
      color: lightgray
      text-decoration: underline
      cursor: default
      &:hover
        color: black
      &:active
        color: lightskyblue
</style>
