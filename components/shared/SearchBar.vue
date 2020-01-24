<template>
  <div class="SearchBar">
    <input v-bind:placeholder="text" v-model="val" @keyup.enter="onSubmit"/>
    <img :src="host+'/static/img/shared/loupe-24.png'" @click="onSubmit"/>
  </div>
</template>

<script>

  export default {
      name: "SearchBar",
      props: ['text'],
      data: function () {
        return{
          host:this.$store.state.host,
          val:'',
        }
      },
      methods:{
        onSubmit:function () {
          //if (this.val==='') return;
          console.log('search');
          this.$emit('search', this.val);
        }
      }
    }
</script>

<style lang="sass" scoped>
  .SearchBar
    display: inline-block
    width: 380px
    input
      width: 300px
      height: 37px
      vertical-align: middle
      font-size: 18px
      font-family: Philosopher
      padding-left: 30px
      padding-right: 40px
    img
      height: 24px
      vertical-align: top
      margin-top: 6px
      margin-left: -37px
      cursor: pointer
</style>
