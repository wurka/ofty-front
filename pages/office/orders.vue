<template>
  <OrderDeal mode="order"/>
</template>

<script>
  import {Module as $store} from "vuex"
  import OrderDeal from "~/components/orders/OrderDeal";

  export default {
    name: "orders",
    components: {OrderDeal},
    data: ()=>({
    }),
    methods: {
    },
    computed: {
    },
    mounted() {
    }
  }
</script>

<style>
</style>
