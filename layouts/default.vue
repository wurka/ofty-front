<template>
  <div>
    <nuxt/>
  </div>
</template>

<style>
  .t1-1 {
    font-family: Philosopher, serif;
    font-size: 31px;
  }
  .t1-2 {
    font-family: Philosopher, serif;
    font-size: 24px;
  }
  .t1-3 {
    font-family: Philosopher, serif;
    font-size: 21px;
  }
  .t1-4 {
    font-family: Philosopher, serif;
    font-size: 18px;
  }
  .t1-5 {
    font-family: Philosopher, serif;
    font-size: 15.5px;
  }
  .t2-1 {
    font-family: Tahoma, serif;
    font-size: 28px;
  }
  .t2-2 {
    font-family: Philosopher, serif;
    font-size: 24px;
  }
  .t2-3 {
    font-family: Philosopher, serif;
    font-size: 21px;
  }
  .t2-4 {
    font-family: Philosopher, serif;
    font-size: 18px;
  }
  .t2-5 {
    font-family: Philosopher, serif;
    font-size: 14px;
  }
  .c1 {
    color: white
  }
  .c2 {
    color: #F6F6F6
  }
  .c3 {
    color: #C4C4C4
  }
  .c4 {
     color: #8A8888
  }
  .c5 {
    color: #000000
  }
  .c6 {
    color: #CA1612
  }
  .c7 {
    color: #12925C
  }
  .c8 {
    color: #182B93
  }
  .bg1 {
    background-color: white
  }
  .bg2 {
    background-color: #F6F6F6
  }
  .bg3 {
    background-color: #C4C4C4
  }
  .bg4 {
    background-color: #8A8888
  }
  .bg5 {
    background-color: #000000
  }
  .bg6 {
    background-color: #CA1612
  }
  .bg7 {
    background-color: #12925C
  }
  .bg8 {
    background-color: #182B93
  }
  .shadow1{
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
  }
body {
  margin: 0;
  background: lightgray;
  height: 100vh;
  overflow-y: scroll;
}
/*html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}*/
</style>

<script>
  import axios from "axios";

  export default {
    methods: {
      aboutMe() { return new Promise((resolve, reject)=> {
          axios
            .get(this.$store.state.host + "/account/about-me")
            .then((ans) => {
              this.$store.state.user.username = ans.data['username'];
              this.$store.state.user.anonymous = ans.data['anonymous'];
              this.$store.state.user.id = ans.data['id'];
              resolve()
            })
            .catch(()=>{reject()})
        })
      },
      enableNotifications() {
        return new Promise((resolve)=>{
          // запросить разрешение на отправку сообщений через Notifications
          if (Notification) {
            Notification.requestPermission().then(
              (result)=>{
                  console.log("alert permission: " + result);
                }).catch()
          }
          resolve();
        })
      },
      subscribeSocket () {
        // подключение к long connect сервисам (WebSocket)
        let anonymous = this.$store.state.user.anonymous,
          socket = this.$store.state.user.webSocket,
          userId = this.$store.state.user.id.toString();

        if (anonymous) {
          // никаких оповещений для незарегистрированных пользователей
          return;
        }

        // проверка на то, что Socket уже был использован;
        if (!socket) {
          let socket_url = 'ws://localhost:9000/ws/user_update/' + userId;
          socket = new WebSocket(socket_url);
          if (socket !== undefined) {
              socket.onmessage = (e) => {
              console.log('on message');
              console.log(e);
              new Notification('this is it', {
                body: e.data,
                icon: this.$store.state.host + '/static/img/shared/message-24.png',
              })
            };
            socket.onclose = (e) => {
              console.log('on close');
              /*console.log(e);*/
            };
          } else {
            console.warn("socket can not be created with url: " + socket_url);
          }
        }
        console.log("socket connected to server");
      }
    },
    mounted() {
      this.$store.dispatch('CSRF_GET');
      this.aboutMe().then(this.enableNotifications).then(this.subscribeSocket);
    }
  }
</script>
