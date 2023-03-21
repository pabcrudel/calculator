<template>
  <h1>Calculator</h1>
  <Calculator/>
</template>

<script setup>
import Calculator from './components/Calculator.vue';
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  font-weight: normal;
}

body {
  margin: 0;
  background: #2c3e50;
  transition: color 0.5s, background-color 0.5s;
  line-height: 1.6;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
  Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1 {
  color: whitesmoke;
  text-align: center;
}
</style>