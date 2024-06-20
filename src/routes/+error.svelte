<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/Button.svelte';
</script>

<div class="wrap">
	<div class="text">
		<h1>Error <span>{$page.status}</span></h1>
		<h2>{$page.error?.message}</h2>
		<div>
			<Button
				value="Back to safety"
				on:click={() => {
					history.back();
				}}
			/>
		</div>
	</div>
</div>

<style lang="scss">
	.wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.text {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		h1 {
			margin: 0px;
			font-size: 5rem;
		}
	}
</style>
