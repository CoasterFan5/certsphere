<script lang="ts">
	export let type: HTMLButtonElement['type'] = 'button';
</script>

<button on:click {type}>
	<span>
		<slot />
	</span>
</button>

<style lang="scss">
	button {
		all: unset;
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1/1;
		box-sizing: border-box;
		border-radius: 50%;
		padding: 0.25rem;
		cursor: pointer;

		&:hover {
			background: rgba(0, 0, 0, 0.2);
		}

		span {
			height: 100%;
			aspect-ratio: 1/1;
		}
	}
</style>
