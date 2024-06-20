<script lang="ts">
    export let value = false;
    export let label = "Toggle"
    export let name = "";
</script>

<label>
    <input type="checkbox"/>
    {label}
</label>

<style lang="scss">

    label {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        cursor: pointer;
    }

    input {
        all: unset;
        height: 1rem;
        aspect-ratio: 7/4;
        background: var(--bgAccent);
        border-radius: 1rem;
        border: 1px solid var(--borders);
        position: relative;

        &::after {
            position: absolute;
            box-sizing: border-box;
            content: "";
            height: calc(1rem - 2px);
            border: -10px solid transparent;
            background: var(--borders);
            aspect-ratio: 1/1;
            left: 1px;
            top: 1px;
            border-radius: 50%;
            transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;
        }

        &:checked {
            &::after {
                left: calc(100% - 1rem + 1px);
                background: var(--primary) !important;
                transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;
            }
        }
    }
</style>