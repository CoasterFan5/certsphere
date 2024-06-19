<script lang="ts">
	import { enhance } from "$app/forms";
	import {toast} from "svelte-french-toast"
	import Button from "$lib/Button.svelte";
	import TextInput from "$lib/TextInput.svelte"
	export let form;

	$: if(form) {
		if(!form.success) {
			toast.error(form.message)
		}
	}
	
</script>

<div class="wrap">
	<form method="post" action="?/login" use:enhance>
		<h2>Login</h2>
		<TextInput label="Email" type="email" name="email" required/>
		<TextInput label="Password" type="password" name="password" required/>
		<Button value="Submit" type="submit" addMarginTop={true}/>
	</form>
</div>

<style lang="scss">
	.wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
	}

	form {
		display: flex;
		align-items: center;
		background: var(--bg);
		box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.1);
		padding: 1rem;
		gap: 0.25rem;
		border-radius: 5px;
		flex-direction: column;
	}
</style>