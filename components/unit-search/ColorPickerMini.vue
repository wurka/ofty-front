<template>
    <div class="ColorPickerMini">
      <div class="content">
        <div class="line">
          <div class="bar1 bar" v-for="b in colorData['group1']" :key="b.id" :style="'background-color: #'+b.rgb_hex" @click="pick(b)"><img :class="pickedIdArr.includes(b.id) ? '' : 'hidden'" :src="host+'/static/img/units/border_38_112_2.png'"/></div>
        </div>
        <div class="line">
          <div class="bar1 bar" v-for="b in colorData['group2']" :key="b.id" :style="'background-color: #'+b.rgb_hex" @click="pick(b)"><img :class="pickedIdArr.includes(b.id) ? '' : 'hidden'" :src="host+'/static/img/units/border_38_112_2.png'"/></div>
        </div>
        <div class="line">
          <div class="bar2 bar" v-for="b in colorData['group3']" :key="b.id" :style="'background-color: #'+b.rgb_hex" @click="pick(b)"><img :class="pickedIdArr.includes(b.id) ? '' : 'hidden'" :src="host+'/static/img/units/border_182_38_2.png'"/></div>
        </div>
        <div class="line">
          <div class="bar3 bar" v-for="b in colorData['group4']" :key="b.id" :style="'background-image: url('+b.texture+');'" @click="pick(b)"><img :class="pickedIdArr.includes(b.id) ? '' : 'hidden'" :src="host+'/static/img/units/border_86_112_2.png'"/></div>
        </div>
        <div class="line">
          <div class="bar3 bar" v-for="b in colorData['group5']" :key="b.id" :style="'background-image: url('+b.texture+');'" @click="pick(b)"><img :class="pickedIdArr.includes(b.id) ? '' : 'hidden'" :src="host+'/static/img/units/border_86_112_2.png'"/></div>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "ColorPickerMini",
    props:['colorData', 'pickedColors'],
    data: function () {
      return {
        host: this.$store.state.host,
      }
    },
    computed:{
      idArr:function(){
        let ans = [];
        for (let g in this.colorData){
          for(let c in this.colorData[g]){
            ans.push(this.colorData[g][c].id);
          }
        }
        return ans;
      },
      pickedIdArr: function () {
        let ans = [];
        for (let i in this.picked){
          ans.push(this.picked[i].id);
        }
        return ans;
      }
    },
  }
</script>

<style lang="sass" scoped>
    $lgray: #f6f6f6
    $shadow: 0px 2px 5px rgba(0, 0, 0, 0.5)
    .ColorPickerMini
      //background-color: lightsalmon
      .content
        margin-left: 15px
        margin-top: 10px
        margin-bottom: 15px
        display: inline-block
        .line
          margin-bottom: 5px
          //display: inline-block
          .bar
            margin-right: 7px
            //background-color: black
            cursor: pointer
            display: inline-block
            box-shadow: $shadow
          .bar1
            height: 25px
            width: 25px
          .bar2
            height: 25px
            width: 121px
          .bar3
            height: 25px
            width: 57px
</style>
