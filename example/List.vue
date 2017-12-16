<template>
	<ul>
		<li v-for="item in products">
			{{item.id}} - {{item.name}}: ${{item.price}} [{{item.inventory}}]
			<button @click="addToCart(item.id)">buy</button>
		</li>
	</ul>
</template>
<script>
import Vue from 'vue'
import { Observable, Action } from '../dist/class'
import Component from 'vue-class-component'

@Component
export default class List extends Vue {
	@Observable('products') products

	@Action('products')
	addToCart () {}

	@Action('products')
	getProducts () {}

	mounted () {
		this.getProducts()
	}
}
</script>