<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { fly } from "svelte/transition";

    const dispatcher = createEventDispatcher()

    let disableClose = false;
    const close = (event: MouseEvent) => {
        console.log(event.currentTarget, event.target)
        if(event.currentTarget == event.target) {
            forceClose()
        }   
    }

    const forceClose = () => {
        dispatcher("close")
    }

    const keyboardHelper = (event: KeyboardEvent) => {
        if(event.key == "Escape" && !disableClose) {
            disableClose = true;
            forceClose()
        }
    }
    

</script>

<svelte:window on:keydown={keyboardHelper}/>
<button class="bg" on:click={close}>
    <!-- svelte-ignore a11y-autofocus -->
    <div autofocus class="content" transition:fly={{x: 0, y: 100, delay: 0, duration: 100}}>
        <slot/>
    </div>
</button>

<style lang="scss">
    .bg {
        all: unset;
        position: fixed;
        top: 0px;
        z-index: 100;
        left: 0px;
        height: 100vh;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(3px);
    }

    .content {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 20rem;
    }
</style>