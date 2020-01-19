<template>
    <div class="CityBlock" v-if="shown">
        <div class="SearchBar">
          <input placeholder="Выберите город"/>
          <img :src="host+'/static/img/shared/loupe-24.png'"/>
        </div>
        <div class="city btn" v-for="c in cities" :key="c.id" @click="myCity=c">{{c}}</div>
    </div>
</template>

<script>
  //import {host} from "~/assets/main";
  export default {
        name: "CityBlock",
        props: ['shown', 'city'],
        data: function () {
            return {
              host:this.$store.state.host,
              cities:['Адлер','Анапа','Алушта','Вязьма','Казань','Коломна','Краснодар','Курск','Москва',
                'Нижний Новгород','Омск','Псков','Самара','Санкт-Петербург','Саратов','Смоленск','Сочи','Суздаль','Тамбов','Тула','Ярославль'
                ],
              myCity: ''
            }
        }
    }
</script>

<style lang="sass" scoped>
  $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
  .CityBlock
    padding: 20px
    background-color: white
    box-shadow: $shadow

    margin-top: 30px
    margin-left: 600px
    float: right
    position: absolute
    width: 200px
    .SearchBar
      display: inline-block
      width: 200px
      input
        border: solid lightgray 1px
        width: 144px
        height: 37px
        vertical-align: middle
        font-size: 18px
        font-family: Philosopher
        padding-left: 10px
        padding-right: 40px
      img
        height: 24px
        vertical-align: top
        margin-top: 6px
        margin-left: -37px
    .city
      margin-top: 10px
</style>
