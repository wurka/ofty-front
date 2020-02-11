<template>
  <div class="office-panel">
    <div class="menu-item">Настройка профиля</div>
    <div class="menu-item">Календарь</div>
    <div class="menu-item" onclick="window.location='/office/orders'">Мои заказы</div>
    <div class="menu-item">Запросы от клиентов</div>
    <div class="menu-item">Мой декор</div>
    <div class="menu-item">Оплата</div>
    <div class="menu-item">Мои коллекции</div>
  </div>
</template>

<script>
    export default {
        name: "OfficeMenu"
    }
</script>

<style scoped lang="sass">
  .office-panel
    background: #f6f6f6
    min-width: 224px
    flex-basis: 224px
    .menu-item
      cursor: pointer
      font-family: Philosopher, serif
      line-height: 40px
      vertical-align: middle
      font-size: 18px
      margin: 0 0 0 20px
      user-select: none
      &:active
        color: gray
      &:hover
        text-decoration: underline
      &:first-child
        margin-top: 10px
      &:last-child
        margin-bottom: 10px




</style>
