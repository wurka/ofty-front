<template>
    <div class="layout">
      <input type="button" value="test" @click="sendMessage">
    </div>
</template>

<script>
    export default {
      name: "demo",
      data: function(){ return {
        socket: null,
      }},
      mounted() {
        this.socket = new WebSocket('ws://localhost:9000/ws/user_update/7');
        this.socket.onmessage = (e)=>{
          console.log('on message');
          console.log(e);
          new Notification('this is it', {
            body: e.data,
            icon: this.$store.state.host + '/static/img/shared/message-24.png',
          })
        };
        this.socket.onclose = (e)=>{
          console.log('on close');
          console.log(e);
        };

        if (Notification) {
          Notification.requestPermission().then((result)=>{console.log(result);}).catch()
        }
      },
      methods: {
        sendMessage() {
          this.socket.send('this is MESSAGE');
        }
      }
    }
</script>

<style scoped lang="sass">
  .layout
    display: flex
    margin: auto
    width: 400px

</style>
