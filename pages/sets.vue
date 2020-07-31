<template>
    <div class="sets-layout">
      <SiteHeader/>
      <div class="body">
        <div class="flex">
          <div class="col">
            <OfficeMenu/>
          </div>
          <div class="col">
            <SearchBar
              text="Поиск по коллекциям"
              @input="onSearch"/>
            <div class="set"
                 v-for="(set, si) in sets"
                 :key="'set_'+si">
              {{set}}
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import SiteHeader from "~/components/shared/SiteHeader";
  import OfficeMenu from "~/components/shared/OfficeMenu";
  import SearchBar from "../components/shared/SearchBar";
  export default {
    name: "sets",
    components: {SearchBar, SiteHeader, OfficeMenu},
    data: function() { return {
      sets: [1,2]
    }},
    methods: {
      onSearch(val) {
        console.log(val);
      }
    },
    mounted() {
      this.$store.dispatch('GET_MY_SETS');
    }
  }
</script>

<style scoped lang="sass">
  .sets-layout
    width: 1140px
    min-height: 100vh
    margin: auto
    background: white
    .flex
      display: flex
      .col:first-child
        padding: 0 0 0 10px
      .col:nth-child(2)
        flex-grow: 1
    .SearchBar
      margin: 0 0 0 285px
</style>
