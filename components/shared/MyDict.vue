<template>
    <div class="MyDict">
    </div>
</template>

<script>
    export default {
      name: "MyDict",
      data: function () {
          return {
            errorDict:{
              'no connection':'Сервер недоступен',

              'not valid user': 'указанный пользователь не найден',
              'no user with this email': 'указанный пользователь не найден',
              'there is no user with email': 'пользователя с такой почтой нет на сайте',
              'email not send: email server connection refused': 'прости, наш почтовый сервер сейчас не работает :(',
              'code not valid or expired':'код неверен или устарел',
              'invalid nickname': 'недопустимое имя пользователя',

              'you must be logged in':'Этот ресурс доступен только зарегистрированым пользователям',
              'please use POST method':'Ошибка на сервере',
              'please use POST request, not':'Ошибка на сервере',
              'there is no parameter':'Ошибка на сервере',
              'login failed':'Неверный логин и/или пароль',
              'password must be at last 4 chars':'Пароль должен быть не менее 4 символов',
              'password not specified':'Пароль не задан',
              'login already exists':'Такой пользователь уже существует',
              'there is no <avatar71> and <avatar170> in FILES':'Выберите изображение для аватара',
              'not valid telephone number:':'Номер телефона указан в недопустимом формате. Укажите номер в формате 8xxx-xxx-xx-xx',
              'There is no specified city in base':'Наш сайт не доступен для указанного города',
              'wrong value:':'Ошибка на сервере: переданы данные в недопустимом формате',
              'hour must be 0 to 23':'Поле "час" имеет некорректное значение',
              'minutes must be 0 to 59':'Поле "минуты" имеет некорректное значение',
              'value must be <true> or <false>':'Некорректное значение переменной',
              'Wrong data structure':'Ошибка на сервере',
              'Wrong data structure (value)':'Ошибка на сервере',
              'Wrong syntax (value)':'Ошибка на сервере',
              'Method not implemented yet':'Функция не реализована на сервере',
              'Wrong syntax (json decode error)':'Ошибка на сервере',
              'delivery parameter must be valid json array':'Ошибка на сервере'
            }
          }
      },
      methods:{
        translateErr:function(text){
          let vm = this,
            ans = 'Неизвестная ошибка на сервере',
            keys = Object.keys(vm.errorDict);

          keys.forEach(function(key){
            let Re = new RegExp("^"+key+".*","gi");
            if (Re.exec(text)) {
              ans=vm.errorDict[key];
            }
            //console.log(key);
          });
          return ans;
        },
      },
    }
</script>

<style lang="sass" scoped>
    .MyDict
        display: none
</style>
