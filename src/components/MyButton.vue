<template>
  <button 
    class="myButton" :class="{'material-symbols-outlined': item === 'backspace'}" 
    @click="useCalculator().handleInput(item)"
    v-html="item" 
  />
</template>

<script setup>
// Pinia stores
import {useCalculator} from '@/stores/calculator';

defineProps({
  item: String
})
</script>

<style scoped>
button {font-size: 1.75rem;}
</style>