<script lang="ts">
	export let value: string = "button";

	export let addMarginTop = false;
	export let type: HTMLButtonElement["type"] = "button"
</script>


<button {type} class:marginTop={addMarginTop}>
	{value}
</button>

<style lang="scss">

	

	button {
		width: 100%;
		border: 1px solid var(--borders);
		outline: 0px;
		font-size: 1rem;
		padding: 0.5rem;
		border-radius: 5px;
		background: var(--bgAccent);
		cursor: pointer;

		&:hover {
			background: var(--bg);
		}
	}

	.marginTop {
		margin-top: 0.5rem;
	}
</style>
