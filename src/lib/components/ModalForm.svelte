<script lang="ts">
	import { enhance } from "$app/forms";
	import { createEventDispatcher } from "svelte";

    export let method: HTMLFormElement["method"] = "post"
    export let action: string; 

    export let title = ""

    export let dispatcher = createEventDispatcher();


</script>

<form {method} {action} use:enhance={() => {
    dispatcher("submit")
}}>
    <h2>{title}</h2>
    <slot/>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        max-width: 20rem;
        flex-grow: 1;
        gap: 1rem;
        width: 100%;
        border-radius: 5px;
        background: var(--bg);
    }

    h2 {
        margin: 0px;
        padding-top: 1rem;
    }
</style>