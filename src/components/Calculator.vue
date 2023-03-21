<template>
  <section id="calculator">
    <div id="results">
      <div id="previous">
        <!-- <p v-html="last.operation"/>
        <p v-html="`= ${last.result}`"/> -->
        <template v-for="lastResult in lastArray">
          <p v-html="lastResult.operation"/>
          <p v-html="`= ${lastResult.result}`"/>
        </template>
      </div>
      <div id="current">
        <p :class="{focus:!saveOperation}" v-html="current.operation"/>
        <p :class="{focus:saveOperation}" v-html="`= ${current.result}`"/>
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
    <!-- <div id="calcPad">
      <MyButton v-for="control in calcButtons" :item="control"/>
    </div> -->
  </section>
</template>

<script setup>
// Components
import NumericPad from './NumericPad.vue';
import MyButton from './MyButton.vue';

// Pinia stores
import {useCalculator} from '@/stores/calculator';
import { storeToRefs } from 'pinia';

const calcButtons = [
  'C', 'backspace', '%', '/',
  '7', '8', '9', '*',
  '4', '5', '6', '-',
  '1', '2', '3', '+',
  '0', '.', '='
]

const specialOperators = ['C', 'backspace', '%']
const basicOperators = ['/', '*', '-', '+', '=']

const {last, lastArray, current, saveOperation} = storeToRefs(useCalculator());
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