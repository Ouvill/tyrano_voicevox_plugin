<script lang="ts">
    import {isDevOpen} from "./store.ts"
    import {fade, fly} from "svelte/transition";
</script>

{#if $isDevOpen}
    <!-- svelte-ignore -->
    <div class="container" transition:fly={{y: 200, duration: 300}}
         on:click={(e) => {e.stopPropagation()}}
    >
        <div in:fade={{duration: 300, delay: 300}}>
            <h1>VOICEVOX管理UI</h1>
            <p class="content">hello world from svelte</p>
        </div>
    </div>
{/if}

<style>
    .container {
        position: fixed;
        display: flex;
        justify-content: center;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        color: white;
        background: lightskyblue;
        pointer-events: auto;
        z-index: 999999998;
    }

    .content {

    }
</style>
