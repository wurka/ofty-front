<template>
    <div class="CascadeCheckboxVariant">
      <input type="checkbox" v-model="checked"/>
      <span class="label">{{label}}</span>
      <cascade-checkbox-variant v-for="c in children" :key="c.id" class="child" :label="c.label" :children="c.children" :parent-checked="checked"></cascade-checkbox-variant>
    </div>
</template>

<script>
    import {myClone} from "~/static/myTools.js";

    export default {
      name: "CascadeCheckboxVariant",
      props:['children', 'label', 'parentChecked', 'filter'],
      data: function () {
          return {
            checked:false,
          }
      },
      watch: {
        parentChecked:function () {
          this.checked=this.parentChecked;
        },
        /*filter:function () {
          console. log(JSON.stringify(this.children))
          let re = new RegExp('\"label\":\"'+this.filter,'gi');
          this.myVariants=myClone(this.children);
          for (let i=this.children.length-1; i>-1;i--){
            console.log( (JSON.stringify(this.myVariants[i])) )
            console.log(!re.exec(JSON.stringify(this.myVariants[i])) + '_' +i)
            if (!re.exec(JSON.stringify(this.myVariants[i]))){
              this.children.splice(i,1);

            }
          }
        }*/
      },
    }
</script>

<style lang="sass" scoped>
    .CascadeCheckboxVariant
      input
        height: 15px
      .child
        margin-left: 7px
</style>
