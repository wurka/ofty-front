<template>

    <div class="PickBar" v-if="shown" >
      <div class="bg" @scroll="yell()" @click="$emit('done', pickedArr); hide();"></div>
      <div class="body" @click="$refs.input.focus()">
        <div class="topPanel">
          <div v-for="p in pickedArr"  :key="p.id" class="picked">
            <span class="text">{{p.name+','}}</span>
          </div>
          <input v-model="val" ref="input" :class="[valid ? '' : 'invalid']" @keyup.enter="pickWord(val)"
                 @keyup.esc="$emit('done', pickedArr); hide();"
                 @keydown.backspace="removeVariant()" @keydown="checkLim"/>
        </div>
        <div class="variants" v-if="showVariants" >
          <div v-for="item in displayed" :key="item.id" class="variant" @click="pickWord(item.name)" >{{item.name}}</div>
        </div>
      </div>

    </div>

</template>

<script>
  import {myClone} from "~/static/myTools.js";
    export default {
      name: "PickBar",
      props:['arr', //массив вариантов
        'picked', //изначально выбранные варианты
        'len', //число символов, начиная с которого выводятся варианты
        'showLim', //число отображаемых вариантов
        'pickLim', //максимальное число выбранных пунктов
        //'shown'
      ],
      data: function () {
          return {
            shown: false,
            host:this.$store.state.host,
            val: '',
            showVariants:false,
            valid: true,
            pickedArr:[],
            focus: true,
            toDelete: false,
            cursor:0,
          }
      },
      computed:{
        displayed: function () {
          console.log('displayed: ');
          console.log(this.pickedArr);
          //this.showVariants=true;
          var vm = this;
          //this.updateWords();
          var re = new RegExp('(^'+this.val+')','i');
          let myIds = this.idArr;
          var ans = this.arr.filter(
            variant => (re.exec(variant.name) && !myIds.includes(variant.id))
          ).slice(0,this.showLim);

          //console.warn(ans);
          return ans;
        },
        idArr: function () {
          let ans=[];
          for (let p in this.pickedArr){
            ans.push(this.pickedArr[p].id);
          }
          return ans;
        }
      },
      methods:{
        show: function(arg){
          if (!arg) arg=[];
          this.shown=true;

          this.pickedArr = myClone(arg);
          //this.$refs.input.focus();
          this.$nextTick(()=>this.$refs.input.focus());
        },
        hide: function(){
          this.shown=false;
          this.val = '';
          this.$emit("hide");
        },
        checkLim:function(e){
          if (this.pickedArr.length >= this.pickLim){
            alert('Допустимо не более '+this.pickLim+' позиций!');
            e.preventDefault();
            return
          }
        },
        pickWord:function (word) {
          if (this.pickedArr.length >= this.pickLim){
            alert('Допустимо не более '+this.pickLim+' позиций!');
            return
          }
          let buf = this.arr.filter(variant=>word===variant.name);
          if (buf.length != 1) {
            console.error('Unknown variant is picked /clone in db');
            return
          }
          this.pickedArr.push(buf[0]);
          console.log(this.pickedArr);
          this.val='';
          this.updateWords();
          this.$refs.input.focus();
        },
        updateWords:function () {
          /*this.idArr=[];
          for (let p in this.pickedArr){
            this.idArr.push(this.pickedArr[p].id);
          }*/
          if (this.val.length<this.len) this.showVariants=false; else
          if (this.displayed.length<1) this.showVariants=false; else this.showVariants=true;
        },
        removeVariant: function(){
          //this.pickedArr.splice(this.pickedArr.indexOf(variant),1);

          if (!this.val) {
            this.pickedArr.pop();
            this.updateWords();
            console.log('ar');
          }else console.log('r');

        },
        yell:function () {
          console.log("AAAAAAAA");
        }
      },
      watch:{
        arr: function () {
          this.displayed;
        },
        val: function () {
          this.updateWords();
          //console.log('val watch');
        },
        /*shown: function () {
          if (this.shown) this.$nextTick(()=>this.$refs.input.focus());
        }*/
      },
      created:function () {
        //this.$nextTick(()=>this.$refs.input.focus());
      }
    }
</script>

<style lang="sass" scoped>
    $lgray: #f6f6f6
    $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
    .bg
      background-color: darkgray
      opacity: 0.3
      position: fixed
      left: 0
      top: 0
      height: 100vh
      width: 100vw
      z-index: 2
    .PickBar
      .body
        width: inherit
        height: inherit
        background-color: white
        border: darkgray solid thin
        position: fixed
        z-index: 2
        cursor: text
        .topPanel
          //background: lightsalmon
          height: inherit
          input
            border: none
            background: none
            font-family: inherit
            font-size: inherit
            //padding: 5px 0px 5px 10px
            padding-left: 10px
            height: inherit
            //width: calc(100% - 20px)
            //padding: 0
            width: 260px
            &:focus
              outline: none
          .pickedBar
            height: 60px
          .picked
            display: inline-block
            margin: 5px 0px 5px 10px
            .text
              //cursor: default
              /*&:hover
                color: red
          .invalid
            //background-color: lightpink
        .variants
          background-color: white
          border: black solid thin
          padding-bottom: 5px
          overflow-y: hidden
          .variant
            margin-left: 10px
            color: darkgray
            cursor: pointer
            &:hover
              color: black
</style>
