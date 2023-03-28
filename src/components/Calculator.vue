<template>
  <section id="calculator">
    <div id="results">
      <div id="previous">
        <template v-for="lastResult in lastArray">
          <p v-html="lastResult.showOperation"/>
          <p v-html="lastResult.showResult"/>
        </template>
      </div>
      <div id="current">
        <p :class="{focus:!isFinished}" v-html="current.showOperation"/>
        <p :class="{focus:isFinished}" v-html="current.showResult"/>
      </div>
    </div>
    <div id="calculatorPad">
      <div id="specialOperators" class="asideButtons">
        <MyButton v-for="control in specialOperators" :item="control"/>
      </div>
      <NumericPad/>
      <div id="basicOperators" class="asideButtons">
        <MyButton v-for="control in basicOperators" :item="control"/>
      </div>
    </div>
  </section>
</template>

<script setup>
// Components
import NumericPad from './NumericPad.vue';
import MyButton from './MyButton.vue';

// Pinia stores
import {useCalculator} from '@/stores/calculator';
import { storeToRefs } from 'pinia';

const specialOperators = ['C', 'backspace', '%']
const basicOperators = ['/', '*', '-', '+', '=']

const {lastArray, current, isFinished} = storeToRefs(useCalculator());
</script>

<style>
#calculator {
  width: clamp(25%, 450px, 100%);
  margin: auto;
  background-color: #fff;
  display: grid;
  grid-template-rows: repeat(2, 1fr);
}

#results {
  display: grid;
  grid-template-rows: 2fr 1fr;
}

#results p {
  margin: auto 2rem auto auto;
  text-align: end;
}

#results #current {
  padding-top: .25rem;
}

#results .focus {
  font-size: larger;
}

#results #previous {
  font-size: small;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}

#calculatorPad {
  border-top: 1px solid black;
  clear: both;
  display: grid;
  grid-template-areas:
  'specialOperators specialOperators specialOperators basicOperators'
  'numericPad numericPad numericPad basicOperators'
  ;
}
#calculatorPad #specialOperators {
  grid-area: specialOperators;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
#calculatorPad #numericPad {grid-area: numericPad;}

#calculatorPad #basicOperators {
  grid-area: basicOperators;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
}

.asideButtons button {
  background: rgba(128, 128, 128, 0.4);
}
</style>