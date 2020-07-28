<template>
  <div class="category-picker-layout">
    <div class="title">Выберите категорию товара</div>
    <div class="navigator">
      <div class="navigator-element" @click="goRoot"> > все товары</div>
      <div class="navigator-element" v-for="(ng, index) in navigatorGroups"
           :key="'ng_' + index"
           @click="goBackGroup(ng)">
        > {{ng.name}}
      </div>
    </div>

    <div class="pictures" v-if="selectGroupMode">
      <div class="loading" v-if="loading">
        <div class="circle">
          <img src="http://zlaksa.ru/static/img/shared/pencil.gif" alt="loading">
        </div>
        <span>Загрузка...</span>
      </div>
      <div class="parent-group" v-if="parentGroup !== ''">
        <div class="line">
          <div class="img-container">
            <img :src="parentGroup['group-image']" alt="parent img">
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

    <div class="set-params" v-if="specifyParamsMode">
      <div class="columns">
        <div class="column-1">
          <div class="picture">
            <img :src="parentGroup['group-size-image']" alt="size img">
          </div>
          <div class="parameters">
            <div class="parameter" v-for="(parameter, pi) in parameters" :key="'par_' + pi">
              <label :for="'pv_' + parameter.id">{{parameter.name}}, {{parameter.dimension}}</label>
              <span>=</span>
              <input
                type="text" :id="'pv_' + parameter.id"
                autocomplete="off"
                @input="parameterChanged"
                class="invalid"
                ref="parameter-input"
              >
            </div>
          </div>
        </div>
        <div class="column-2">
          <div class="line" @click="showPickBar">
            <label for="materials">Материал
              <img
                title="Выберите до 5 материалов"
                :src="$store.state.host + '/static/img/shared/info.png'"
                alt="info.png">
            </label>
            <Picker ref="materialPicker"
                    id="materials"
                    @valueChanged="validateAllParameters"/>
          </div>
          <div class="line">
            <label for="weight">Вес, кг</label>
            <input type="text" id="weight" autocomplete="off"
                   v-model="inputWeight"
                   :class="{invalid: !validWeight}">
          </div>
          <div class="line">
            <label for="count">Количество</label>
            <input type="text" id="count"
                   v-model="inputCount"
                   :class="{invalid: !validCount}"
                   autocomplete="off">
          </div>
          <div class="line">
            <label for="unit-name">Название</label>
            <input type="text" id="unit-name"
                   v-model="inputName"
                   :class="{invalid: !validName}"
                   placeholder="введите название"
                   autocomplete="off">
          </div>
          <div class="line disabled">
            <label for="set">Коллекция</label>
            <input type="text" id="set" autocomplete="off" tabindex="-1"
                   placeholder="в разработке...">
          </div>
          <div class="line disabled">
            <label for="keywords">Ключевые слова</label>
            <input type="text" id="keywords" autocomplete="off"
                   placeholder="в разработке..."
                   tabindex="-1">
          </div>
          <div class="line">
            <label for="commentary">Комментарий</label>
            <textarea id="commentary" autocomplete="off"
                      v-model="inputCommentary"
                      :class="{invalid: !validCommentary}"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import PickBar from "~/components/shared/PickBar";
  import Picker from "~/components/Picker";

  const rootGroup = {
    id: 0,
    name: "blank",
    'group-image': 'https://dummyimage.com/155x155.png',
    'group-size-image': 'https://dummyimage.com/155x155.png',
    active: false
  };

  export default {
    name: "category-picker",
    components: {PickBar, Picker},
    data: function() {
      return {
        selectGroupMode: true,
        specifyParamsMode: false,
        loading: true,
        groups: [],
        parentGroup: rootGroup,
        navigatorGroups: [],
        parameters: [],
        allMaterials: [],
        selectedMaterials: [],
        validated: false,  // true => все исходные данные введены верно
        isMounted: false,
        pickBarShown: false,
        inputWeight: '1',
        inputCount: '1',
        inputName: '',
        inputCommentary: '',
        selectedGroup: undefined,
        demoParameters: [],
      }
    },
    mounted() {
      this.loadGroups().then(this.validateAllParameters);
      this.getAllMaterials();
      this.isMounted = true;
    },
    watch: {
      inputCount(newVal) {
        this.inputCount = newVal.replace(/,/g, '.');
        this.validateAllParameters();
      },
      inputName() {
        this.validateAllParameters();
      },
      inputWeight(newValue) {
        this.inputWeight = newValue.toString().replace(/,/g, '.');
        this.validateAllParameters();
      }
    },
    computed: {
      validName() {
        return this.inputName !== '';
      },
      validCommentary() {
        return true;
      },
      validWeight() {
        if (this.inputWeight) {
          let int_val = parseFloat(this.inputWeight);
          if (isNaN(int_val)) {
            return false;
          }
          // допустимый диапазон
          return  (
            (int_val > 0) &&
            (int_val < 3000) &&
            // проверка на невалидные суффиксы
            (int_val.toString() === this.inputWeight)
          );
        } else {
          return false;
        }

      },
      validCount() {
        if (this.inputCount) {
          let int_val = parseFloat(this.inputCount);
          if (isNaN(int_val)) {
            return false;
          }
          return ((int_val > 0) && (int_val < 1000));
        }
        return false;
      },
      materialsStr: function () {
        let ansArr=[],
          selected = this.selectedMaterials;
        //console.log(this.addDict['unit-materials']);
        for (let i in selected){
          let mat = this.allMaterials.filter(m => m.id===selected[i].id);
          ansArr.push(mat[0].name);
        }
        let ans = ansArr.join(', ');
        if (ans.length>16) ans=ans.substring(0,16)+'...';
        return ans;
      }
    },
    methods: {
      showPickBar(){
        if (!this.pickBarShown) {
          //this.$refs.PickBar.show(this.selectedMaterials);
          //this.pickBarShown = true;
        }
      },
      hidePickBar() {
        this.pickBarShown = false;
      },
      getAllMaterials() {
        axios
          .get(this.$store.state.host + "/units/materials-source")
          .then((result)=>{
            this.allMaterials = result.data;
          });
      },
      loadGroups() {
        return new Promise((resolve, reject)=>
        {
          let gg_url = this.$store.state.host + '/units/get-groups',
            gp_url = this.$store.state.host + "/units/get-group-parameters",
            config = {};

          if (this.parentGroup.id !== 0) {
            config = {
              params: {'parentid': this.parentGroup.id}
            }
          }

          this.selectGroupMode = !this.parentGroup.active;
          this.specifyParamsMode = this.parentGroup.active;

          if (this.parentGroup.active) {
            // у активной группы спрашиваем параметры с сервера
            axios
              .get(gp_url, {params: {groupid: this.parentGroup.id}})
              .then((result) => {
                let ans = JSON.parse(result.data.parameters);
                console.log(ans);
                this.parameters = ans;
                resolve();
              })

          } else {
            // у неактивной группы спрашиваем подгруппы
            axios
              .get(gg_url, config)
              .then((result) => {
                this.loading = false;
                console.log(result.data);
                this.groups = result.data;
                resolve();
              })
          }
        })
      },
      setParent(group) {
        this.parentGroup = group;
        this.loadGroups();
      },
      goRoot() {
        this.parentGroup = rootGroup;
        this.navigatorGroups = [];
        this.loadGroups().then(this.validateAllParameters);

      },
      goNextGroup(group) {
        // перейти на следующую в дереве группу
        this.navigatorGroups.push(group);
        this.setParent(group);
        this.loadGroups().then(this.validateAllParameters);
      },
      goBackGroup(group) {
        // откатиться до указанной группы в дереве
        let newLength = 0;
        this.navigatorGroups.forEach((g, index)=>{
          if (g.id === group.id) {
            newLength = index + 1;
          }
        });

        // не надо ничего делать, если переходят на последнюю группу
        if (newLength !== this.navigatorGroups.length) {
          this.navigatorGroups.splice(newLength);
          this.setParent(group);

          this.selectGroupMode = !group.active;
          this.specifyParamsMode = group.active;
          this.validateAllParameters();
        }
      },
      validateAllParameters() {
        // невалидно, если есть хотя бы один невалидный параметр
        // или текущая группа - не активная
        if (this.parentGroup.active) {
          this.validated = true;
          this.$refs['parameter-input'].forEach((item)=>{
            if (item.classList.contains('invalid')) {
              this.validated = false;
            }
          });

          // проверка материалов
          this.validated = this.validated && this.$refs.materialPicker.isValid;
          // проверка веса
          this.validated = this.validated
            && this.validWeight
            && this.validCount
            && this.validCommentary;

        } else {
          this.validated = false;
        }

        if (this.validated === false) {
          this.selectedGroup = undefined;  // если что-то не валидно - считаем, что ничего не выбрано
        } else {
          let names = [];
          for (let g of this.navigatorGroups) {
            names.push(g.name);
          }

          this.selectedGroup = {
            'group-image': this.parentGroup["group-image"],
            'group-size-image': this.parentGroup["group-size-image"],
            'id': this.parentGroup.id,
            'names': names
          }

          this.demoParameters = this.parameters;
          for (let parameter of this.demoParameters) {
            parameter.value = document.getElementById('pv_'+parameter.id).value;
          }
        }

        this.$emit("validatedChanged");
      },
      parameterChanged(event) {
        let value = event.target.value,
          intValue = parseInt(value);

        if (intValue.toString() !== value) {
          event.target.classList.add('invalid');
        } else {
          event.target.classList.remove('invalid');
        }
        this.validateAllParameters();
      },
      updateMaterials(arr) {
        console.log(arr);
        this.selectedMaterials = arr;
      }
    }
  }
</script>

<style scoped lang="sass">
  .category-picker-layout
    width: 1080px
    background: white
    font-family: Philosopher,serif
    font-size: 24px
    margin: 0 auto
    border: none
    padding: 0 35px 0 0
    box-sizing: border-box
    .pictures
      max-height: calc(100vh - 500px)
      overflow-y: scroll
      overflow-x: hidden
    .title
      text-align: center
    .loading
      margin: auto
      display: flex
      align-items: center
      .circle
        flex-grow: 1
        border-radius: 50%
        display: inline-block
        position: relative
        text-align: center
      span
        color: gray
        flex-grow: 2
        vertical-align: middle
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

    .set-params
      .columns
        display: flex
      .column-1
        flex-basis: 200px
        padding: 33px 100px 0 45px
        .picture
          box-sizing: border-box
          border: 1px solid gray
          width: 330px
          height: 330px
          text-align: center
          line-height: 330px
          img
            vertical-align: middle

        .parameters
          padding: 70px 0 0 0
          .parameter
            margin: 0 0 10px 0
            label
              display: inline-block
              min-width: 80px
            input
              display: inline-block
              line-height: 25px
              padding: 1px
              border: 1px solid gray
              width: 216px
              font-family: Philosopher, serif
              font-size: 24px
            .invalid
              border: 1px solid red
      .column-2
        flex-grow: 1
        padding: 33px 45px 0 0
        .line
          &.disabled
            color: gray
            pointer-events: none
            input

          display: grid
          grid-template-columns: 1fr 1fr
          margin: 0 0 15px 0
          textarea, input
            font-family: Philosopher, serif
            font-size: 24px
            box-sizing: border-box
            width: 250px
            padding: 0 5px 0 5px
          textarea
            resize: none
          input:disabled
            background: white
            border: 1px solid #C4C4C4
            cursor: text

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
