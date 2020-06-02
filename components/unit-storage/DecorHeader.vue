<template>
    <div class="DecorHeader">
      <div class="flex">
        <div class="btn" @click="$refs.decorAdd.show()">+ Добавить предмет</div>
        <search-bar text="Поиск в моем декоре" @input="decorSearch" @change="decorSearch" @search="decorSearch"></search-bar>
        <span class="counter">Загружено товаров {{mine}}/{{all}}</span>
      </div>
      <!--decor-add :shown="showAddDecor" :editParams="editParamsVal" ref="decorAdd" @hide-add-decor="showAddDecor = false; $emit('hide-add-decor');"></decor-add-->
      <NewUnitWizard
        :shown="showAddDecor"
        :editParams="editParamsVal"
        ref="decorAdd"
        @hide-add-decor="hideWizard"/>
    </div>
</template>

<script>
    import DecorAdd from "./DecorAdd";
    import SearchBar from "../shared/SearchBar";
    import NewUnitWizard from "./NewUnitWizard";
    var ax;
    export default {
      name: "DecorHeader",
      components: {SearchBar, DecorAdd, NewUnitWizard},
      props:['showAdd', 'editParams'],
      data: function () {
            return {
              showAddDecor: false,
              mine:0,
              all:0,
              editParamsVal:{},
              host:this.$store.state.host,
            }
      },
      computed:{
        decorAdd : function() {
          return this.$refs.decorAdd;
        }
      },
      methods:{
        stockInfo:function () {
          let vm = this;
          ax.get(vm.host + '/account/about-me')
            .then(function (data) {
                //console.log(data.data);
                vm.all = data.data['stock-capacity'];
                vm.mine = data.data['stock-occupied'];
                //vm.$forceUpdate();
              }
            )
            .catch(function (data) {
                if(data.response){
                  console.warn(data.response.data);
                }
                else
                  console.warn('no connection')
              }
            );

        },
        decorSearch:function (val) {
          console.log('decor search: '+val);
          this.$emit('decor-search', val);
        },
        hideWizard() {
          this.$refs.decorAdd.shown = false;
        }
      },
      created:function () {
        ax = this.$axios.create({  baseURL: this.host});
        this.stockInfo();
      },
      watch:{
        showAdd:function () {
          this.showAddDecor = this.showAdd;
          console.log('showAdd')
        },
        editParams:function () {
          this.editParamsVal = this.editParams;
          console.log('editParams');
        },
        showAddDecor:function () {
          if (this.showAddDecor)
            if (this.mine === this.all ) {
              alert('Купите место!');
              this.showAddDecor = false;
            }
          else {
            this.editParamsVal = {};
          }
        }

      }
    }
</script>

<style lang="sass" scoped>
    $lgray: #f6f6f6
    $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
    .flex
      display: flex
    .DecorHeader
      //background-color: lightpink
      //text-align: right
      .btn
        padding: 8px 0 8px 20px
        font-size: 18px
        width: 188px
        //margin: 0 30px 0 0
      .counter
        //margin: 5px
        //width: 200px
        font-size: 14px
        float: right
        margin: 10px 0 0 0
        text-align: right
        font-family: Tahoma, serif
        width: 188px
      .SearchBar
        //margin-right: 25px
        margin-left: 60px

</style>

