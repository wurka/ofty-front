<template>
  <div class="layout" v-if="shown">
    <div class="steps">
      <div class="step" v-for="i in 4" :key="'step_' + i"
        :class="{'selected': step === i}"
        @click="goStep(i)">{{i}}
      </div>
    </div>
    <div class="step-1" v-show="step === 1">
      <CategoryPicker ref="CategoryPicker" @validatedChanged="checkNextStepAvailable"/>
    </div>
    <div class="step-2" v-show="step === 2">
      <PhotoAndColorPicker ref="PhotoAndColorPicker" @validatedChanged="checkNextStepAvailable"/>
    </div>
    <div class="step-3" v-show="step === 3">
      <CostPicker ref="CostPicker" @validatedChanged="checkNextStepAvailable"/>
    </div>
    <div class="step-4" v-show="step === 4">
      <Summary ref="Summary"/>
    </div>
    <div class="buttons">
      <input type="button" class="button" value="Отмена" @click="emitHide">
      <input
        :class="{'disabled' : !nextStepAvailable }"
        type="button" class="button" :value="goAheadText" @click="goNext">
    </div>
  </div>
</template>

<script>
  import CategoryPicker from "~/components/unit-storage/CategoryPicker";
  import PhotoAndColorPicker from "~/components/unit-storage/PhotoAndColorPicker";
  import CostPicker from "~/components/unit-storage/CostPicker";
  import Summary from "~/components/unit-storage/Summary";
  import axios from "axios";

  export default {
    name: "NewUnitWizard",
    components: {PhotoAndColorPicker, CategoryPicker, CostPicker, Summary},
    data: function () {
      return {
        isMounted: false,
        shown: false,
        step: 1,
        nextStepAvailable: false,
      }
    },
    mounted() {
      this.isMounted = true;
      window.onbeforeunload = function () {
        if (this.shown) {
          return "Данные о товаре будут потеряны. Всё-равно  уйти?";
        }
      };
    },
    computed: {
      goAheadText() {
        return this.step===4 ? 'Создать' : 'Далее';
      }
    },
    methods: {
        dataURItoBlob(dataURI) {
          let byteString = atob(dataURI.split(',')[1]),
            mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0],
            ab = new ArrayBuffer(byteString.length),
            ia = new Uint8Array(ab);

          for (let i = 0; i < byteString.length; i++){
            ia[i] = byteString.charCodeAt(i);
          }
          let blob = new Blob([ab], {type: mimeString});
          return blob;
        },
      checkNextStepAvailable(){
        // защита от неинициализированных $refs
        if (!this.isMounted) {
          this.nextStepAvailable = false;
        }
        let summary = this.$refs.Summary;

        if (this.step === 1) {
          this.nextStepAvailable = this.$refs['CategoryPicker'].validated;
          let picker = this.$refs.CategoryPicker,
            sg = this.$refs.CategoryPicker.selectedGroup;
          summary.groups = sg === undefined ? [] : sg.names;
          summary.groupId = sg === undefined ? 0 : sg.id;
          summary.typeImage = sg === undefined ?
            this.$store.host + '/static/img/shared/no_image.png' : sg['group-size-image'];
          summary.parameters = sg === undefined ? [] : picker.demoParameters;
          summary.weight = picker.inputWeight;
          summary.commentary = picker.inputCommentary;
          summary.name = picker.inputName;
          summary.count = picker.inputCount;
        } else if (this.step === 2) {
          let picker = this.$refs['PhotoAndColorPicker'];
          this.nextStepAvailable = picker.validated;
          if (!picker.validated) {
            summary.colors = [];
            summary.photos = [];
          } else {
            summary.colors = picker.demoColors;
            summary.photos = picker.images.filter((i)=>{return i !== picker.defaultImage;});
          }
        } else if (this.step === 3) {
          this.nextStepAvailable = this.$refs['CostPicker'].validated;
          summary.costs = this.$refs.CostPicker.costs;
          summary.bail = this.$refs.CostPicker.bail;
        } else if (this.step === 4) {
          this.nextStepAvailable = this.$refs['Summary'].validated;
        } else {
            this.nextStepAvailable = false;
        }


      },
      show : function(params){
        this.step = 1;
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
        this.checkNextStepAvailable();
      },
      goNext() {
        if (this.step <= 3) {
          this.step += 1;
          this.checkNextStepAvailable();
        } else {
          // конец шагов (надо создавать, а не переходить)
          let vm = this,
            sum = this.$refs.Summary,
            fd = new FormData(),
            colors = sum.colors.map((c)=>c.id),
            // переработать массив в словарь
            parameters = Object.assign({},
              ...sum.parameters.map((x)=>({[x.id]: x.value}))),
            materials = this.$refs.CategoryPicker.selectedMaterials.map(
              (x)=>(x.id)),
            sets = [],
            keywords = [];
          fd.append('weight', sum.weight);
          fd.append('bail', sum.bail);
          fd.append('count', sum.count);
          fd.append('title', sum.name);
          fd.append('costs', JSON.stringify(sum.costs));
          fd.append('unit-group', sum.groupId);
          fd.append('unit-colors', JSON.stringify(colors));
          fd.append('parameters', JSON.stringify(parameters));
          fd.append('unit-materials', JSON.stringify(materials));
          fd.append('sets', JSON.stringify(sets));
          fd.append('keywords', JSON.stringify(keywords));
          fd.append('description', sum.commentary);
          fd.append('published', JSON.stringify(true));
          sum.photos.forEach((p, i)=>{
            fd.append('photo'+(i+1), this.dataURItoBlob(p));
          });


          axios
            .post(this.$store.state.host + "/units/add-new-unit", fd,{headers: {
                "X-CSRFToken": vm.$store.state.csrf.csrf
              }})
            .then((response)=>{alert('ok')})
            .catch((error)=>{console.log(error.response)});
        }
      },
      emitHide() {
        this.$emit('hide-add-decor');
      }
    }
  }
</script>

<style scoped lang="sass">
  .disabled
    color: gray
    pointer-events: none
    cursor: not-allowed
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
