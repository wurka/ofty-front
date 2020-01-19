<template>
    <div class="DecorHeader">
      <div class="btn" @click="$refs.decorAdd.show();">+ Добавить предмет</div>
      <span> <search-bar text="Поиск в моем декоре" @search="decorSearch"></search-bar></span>
      <span class="counter">Загружено товаров {{mine}}/{{all}}</span>
      <decor-add :shown="showAddDecor" :editParams="editParamsVal" ref="decorAdd" @hide-add-decor="showAddDecor = false; $emit('hide-add-decor');"></decor-add>
    </div>
</template>

<script>
    import DecorAdd from "./DecorAdd";
    import SearchBar from "../shared/SearchBar";
    var ax;
    export default {
      name: "DecorHeader",
      components: {SearchBar, DecorAdd},
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
            if (this.mine == this.all ) {
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
    .DecorHeader
      //background-color: lightpink
      //text-align: right
      .btn
        display: inline-block
        background-color: white
        //border: solid $lgray 1px
        padding: 8px 0 8px 20px
        //margin: 5px
        box-shadow: $shadow
        font-size: 18px
        width: 188px
      .counter
        //margin: 5px
        //width: 200px
        font-size: 14px
        float: right
        margin: 10px 47px 0 0
        font-family: Tahoma
      .SearchBar
        //margin-right: 25px
        margin-left: 47px

</style>
