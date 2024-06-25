<script lang="ts">
	export let type: HTMLButtonElement['type'] = 'button';
	export let disabled: boolean = false;
	export let href = ""
</script>

{#if href}
	<a class="button" {href} {disabled} on:click>
		<span>
			<slot />
		</span>
	</a>
{:else}
	<button class="button" {disabled} on:click {type}>
		<span>
			<slot />
		</span>
	</button>
{/if}


<style lang="scss">
	.button {
		all: unset;
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1/1;
		box-sizing: border-box;
		border-radius: 50%;
		padding: 0.25rem;
		cursor: pointer;

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&:hover {
			background: rgba(0, 0, 0, 0.2);
		}

		span {
			height: 100%;
			aspect-ratio: 1/1;
		}
	}
</style>
