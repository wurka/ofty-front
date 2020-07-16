<template>
    <div class="cost-picker">
      <div class="title">Укажите стоимость аренды товара</div>
      <div class="bail line">
        <label for="bail-value">Залог</label>
        <input type="text" name="bail-value" id="bail-value"
               :class="{invalid: !bailValid}"
               autocomplete="off"
               v-model="bail">
      </div>
      <div class="costs">
        <div class="no-cost" v-if="costs.length===0">
          Нет тарифов
        </div>
        <div class="cost" v-for="(cost, ci) in costs" :key="'cost_'+ ci">
          <div class="text">
            <div class="column">
              {{ cost.text }}
            </div>
            <div class="column"
                 @click="deleteCost(ci)">
              удалить
            </div>
          </div>
        </div>
      </div>
      <div class="new-cost-title line">
        Добавить количество дней или часов для сдачи в аренду
      </div>
      <div class="selector">
        <div class="hour-select variant" :class="{selected: newCostMode==='hour'}"
             @click="newCostModeSet('hour')">
          <img :src="$store.state.host+'/static/img/shared/clock.svg'" alt="clock.svg">
          <div class="name">Часы</div>
        </div>
        <div class="day-select variant" :class="{selected: newCostMode==='day'}"
             @click="newCostModeSet('day')">
          <img :src="$store.state.host+'/static/img/shared/moon-star.svg'" alt="moon-star.svg">
          <div class="name">Сутки</div>
        </div>
      </div>
      <div class="new-cost line">
        <div class="from">
          <label for="from">От</label>
          <input type="text" id="from" v-model="newFrom"
                 autocomplete="off"
                 :class="{invalid: !newFromValid}">
          <label for="from" v-if="newCostMode==='hour'">ч.</label>
          <label for="from" v-if="newCostMode==='day'">д.</label>
        </div>
        <div class="new-cost-value">
          <label for="new-cost-value">Цена</label>
          <input type="text" id="new-cost-value" v-model="newCost"
                 autocomplete="off"
                 :class="{invalid: !newCostValid}">
          <label for="new-cost-value">р.</label>
        </div>
      </div>
      <div class="new-cost-add line">
        <span :class="{disabled: !(newCostValid && newFromValid)}"
              @click="addNewCost">Добавить</span>
      </div>
    </div>
</template>

<script>
    export default {
      name: "CostPicker",
      data: function () { return {
        costs: [
          //{type: 'day', duration: 3, cost: 100},
          //{type: 'hour', duration: 10, cost: 20},
        ],  // список цен для товара
        newCostMode: 'hour',
        bail: 100,
        bailValid: true,
        newFrom: 1,
        newFromValid: true,
        newCostValid: true,
        newCost: 1
      }},
      computed: {
        validated() {
          // введены все нужные значения и они корректны
          return (this.costs.length > 0) && (this.bailValid);
        }
      },
      watch: {
        bail(newValue) {
          let intBail = parseInt(newValue);

          if (!isNaN(intBail)) {
            this.bail = intBail;
            this.bailValid = true;
          } else {
            this.bailValid = false;
          }
        },
        newFrom(newValue) {
          let intValue = parseInt(newValue);

          if (!isNaN(intValue)) {
            this.newFrom = intValue;
            this.newFromValid = true;
          } else {
            this.newFromValid = false;
          }
        },
        newCost(newValue) {
          let intCost = parseInt(newValue);
          if (!isNaN(intCost)) {
            this.newCost = intCost;
            this.newCostValid = true;
          } else {
            this.newCostValid = false;
          }
          this.$emit('validatedChanged');
        }
      },
      methods: {
        deleteCost(costIndex) {
          //удалить стоимость и указанным индексом
          this.costs.splice(costIndex, 1);
          console.log(costIndex);
          console.log(this.costs);
        },
        getCostText(mode, duration, value) {
          return 'От ' + duration + ' ' +
            (mode === 'day'?
              this.daysText(duration) : this.hoursText(duration)) +
            ' - ' + value + (mode === 'day' ? ' р/день' : ' р/час');
        },
        addNewCost() {
          // добавить новый пункт с ценами
          if (!(this.newFromValid && this.newCostValid)) {
            alert("Введены некорректные данные");
            return;
          }

          let newCost = {
            type: this.newCostMode,
            duration: this.newFrom,
            cost: this.newCost,
            text: this.getCostText(this.newCostMode, this.newFrom, this.newCost)
          }

          this.costs.push(newCost);

          this.$emit('validatedChanged');
        },
        newCostModeSet(newValue) {
          this.newCostMode = newValue;
        },
        hoursText(hours) {
          let txt = hours.toString(),
            lastChar = txt[txt.length-1];
          if (txt.endsWith('11')) {
            return 'часов';
          }
          if (lastChar === '1') {
            return 'часа';
          } else {
            return 'часов';
          }
        },
        daysText(days) {
          let txt = days.toString(),
            lastChar = txt[txt.length-1];
          if (txt.endsWith('11')) {
            return 'дней';
          }
          if (lastChar === '1') {
            return 'дня';
          } else {
            return 'дней';
          }
        }
      }
    }
</script>

<style scoped lang="sass">
  .cost-picker
    font-family: Philosopher, serif
    .title
      font-size: 21px
      text-align: center
      margin: 0 0 71px 0
    .line
      text-align: center
    .bail
      label
        display: inline-block
        min-width: 56px
      input
        width: 400px
        height: 27px
        font-size: 18px
        font-family: Philosopher, serif
    .costs
      width: 456px
      margin: 10px auto
      .no-cost
        text-align: center
        margin: 24px 0 0 0
        font-size: 18px
        color: gray
      .cost
        margin: 15px 0 15px 0
        .text
          display: flex
          .column:first-child
            flex-grow: 1
          .column:nth-child(2)
            display: none
            text-decoration: underline
            cursor: pointer
          &:hover
            .column:nth-child(2)
              display: block
    .new-cost-title
      margin: 41px 0 41px 0
      font-size: 18px
    .selector
      text-align: center
      .variant
        display: inline-block
        border: 1px solid lightgray
        width: 230px
        padding: 11px 0
        user-select: none
        cursor: pointer
        margin: 0 30px
        &:hover
          background: #F5F5F5
      & .selected
        border-color: black
    .new-cost
      margin: 48px 0 0 0
      .from, .new-cost-value
        width: 230px
        display: inline-block
        input
          width: 120px
          height: 27px
          text-align: right
          padding: 0 10px 0 10px
          box-sizing: border-box
          font-size: 18px
      .from
        margin: 0 20px 0 0
        label:first-child
          margin: 0 10px 0 0
          display: inline-block
      .new-cost-value
        label:first-child
          margin: 0 10px 0 0
          display: inline-block
      .new-cost-value
        margin: 0 0 20px 0
    .new-cost-add
      span
        text-decoration: underline
        display: inline-block
        cursor: pointer
        width: 410px
        margin: auto
        text-align: right
        color: black
        user-select: none
        &:active
          color: gray
    .invalid
      border: 1px solid red
      border-radius: 3px
    .disabled
      opacity: 0.6
      pointer-events: none


</style>
