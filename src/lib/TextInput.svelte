<script lang="ts">
	export let label: string;
	export let name: string;
	export let required = false;
	export let value: string | undefined = undefined;

	export let type: "email" | "password" | undefined = undefined;
</script>

<label>
	<span>{label}</span>
	{#if type == "password"}
		<input bind:value name={name} {required} type="password" placeholder={label}>
	{:else if type == "email"}
		<input bind:value name={name} {required} type="email" placeholder={label}>
	{:else}
		<input bind:value name={name} {required} placeholder={label}>
	{/if}
</label>

<style lang="scss">
	label {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: center;
		font-size: 0.9rem;
		
		span {
			opacity: 0.8;
			margin-bottom: 0.25rem;
		}
	}

	input {
		border: 1px solid var(--borders);
		outline: 0px;
		font-size: 1rem;
		padding: 0.5rem;
		border-radius: 5px;
		background: var(--bgAccent);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;

		&:focus {
			border: 1px solid var(--primary);
		}
	}
</style>
