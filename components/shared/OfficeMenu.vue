<template>
  <div class="office-panel">
    <a class="menu-item" href="/account-settings">Настройка профиля</a>
    <div class="menu-item disabled">Календарь</div>
    <a class="menu-item" href="/office/orders">Мои заказы</a>
    <a class="menu-item" href="/office/deals">Запросы от клиентов</a>
    <a class="menu-item" href="/unit-storage">Мой декор</a>
    <div class="menu-item disabled">Оплата</div>
    <div class="menu-item disabled">Мои коллекции</div>
  </div>
</template>

<script>
    export default {
        name: "OfficeMenu"
    }
</script>

<style scoped lang="sass">
  .disabled
    color: gray !important
    cursor: not-allowed !important
    pointer-events: none
  .office-panel
    background: #f6f6f6
    min-width: 224px
    flex-basis: 224px
    a
      display: block
    .menu-item
      color: black
      text-decoration: none
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
        margin-top: 0
      &:last-child
        margin-bottom: 10px




</style>
