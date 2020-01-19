<template>
  <div class="FavorSiteBody">
    <search-bar :text="'Поиск в избранном'"></search-bar>
    <div class="cardPanel">
      <favor-card v-for="card in cards" :key="card.id"></favor-card>
    </div>
  </div>
</template>

<script>
    import FavorCard from "./FavorCard";
    export default {
        name: "FavorSiteBody",
      components: {FavorCard},
      data: function () {
            return {
              cards:'123',
            }
        }
    }
</script>

<style lang="sass" scoped>
  .FavorSiteBody
    .SearchBar
      margin-left: 520px
</style>
