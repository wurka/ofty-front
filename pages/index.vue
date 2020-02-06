<template>
  <div class="container">
    <div>
      Привет, Маша, это место для главной страницы нашего сайта.
    </div>
    <div>
      <a href="/account-settings">Настройка профиля (account-settings)</a>
    </div>
    <div>
      <a href="/unit-search">Поиск товаров (unit-search)</a>
    </div>
    <div>
      <a href="/unit-storage">Склад (unit-storage)</a>
    </div>
    <div>
      <a href="/welcome">Welcome (welcome)</a>
    </div>
    <div>
      <a href="/office/orders">Список заказов (/office/orders)</a>
    </div>
    <div>
      <a href="/office/basket">Корзина заказов (/office/basket)</a>
    </div>
  </div>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'

export default {
  components: {
    AppLogo
  }
}
</script>

<style lang="sass">
.container
  min-height: 50vh
  justify-content: center
  align-items: center
  text-align: center
  font-size: 26px
  margin-top: 20vh

</style>

