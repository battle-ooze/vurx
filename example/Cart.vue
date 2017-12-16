<template>
	<ul>
		<li v-for="item in cart">
			{{item.name}}: ${{item.price}} * {{item.count}}

		</li>
		<li> Total: {{total}}</li>
	</ul>
</template>
<script>
import Vue from 'vue'
import { Observable, Action } from '../dist/class'
import Component from 'vue-class-component'

@Component
export default class Cart extends Vue {
	@Observable('cart') cart
	@Observable('cart') total
}
</script>