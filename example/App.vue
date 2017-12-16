<template>
  <div>
  	Products
    <TheList></TheList>

    Cart
    <TheCart></TheCart>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import TheList from './List.vue'
import TheCart from './Cart.vue'

@Component({
	components: {TheList, TheCart}
})
export default class App extends Vue {}
</script>