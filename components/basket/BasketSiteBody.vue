<template>
  <div class="BasketSiteBody">
    <search-bar :text="'Поиск в избранном'"></search-bar>
    <div class="cardPanel">
      <basket-card v-for="card in cards" :key="card.id"></basket-card>
    </div>
  </div>
</template>

<script>
  import BasketCard from "./BasketCard";
  export default {
    name: "BasketSiteBody",
    components: {BasketCard},
    data: function () {
      return {
        cards:'123',
      }
    }
  }
</script>

<style lang="sass" scoped>
  .BasketSiteBody
    .SearchBar
      margin-left: 520px
</style>
