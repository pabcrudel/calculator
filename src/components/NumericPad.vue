<template>
    <div id="numericPad">
        <MyButton v-for="n in numOrder" :item="n"/>
    </div>
</template>

<script setup>
// Components
import MyButton from './MyButton.vue';

const numOrder = ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0']

// const num = "5.4";
// const res = Number(num) + .3;
// console.log(res)
</script>

<style scoped>
#numericPad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    direction: rtl; /* establece la dirección del flujo en de derecha a izquierda */
}
#numericPad >:last-child {
    grid-row-start: 4;
}
#numericPad >:nth-last-child(1) {
    grid-column: span 3;
}
</style>