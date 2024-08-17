<script lang="ts">
  import { isDevOpen } from "./store.ts";
  import { fade, fly } from "svelte/transition";
  import { taskStore } from "./task-store.ts";

  // ティラノスクリプトはlayer_menuのクラスのstyleが`display: none`以外の時イベントを実行しない。
  const disable_tyrano_event_class = "layer_menu";
</script>

{#if $isDevOpen}
  <div
    class="container {disable_tyrano_event_class}"
    transition:fly={{ y: 200, duration: 300 }}
  >
    <div in:fade={{ duration: 300, delay: 300 }}>
      <h1>VOICEVOX管理UI</h1>

      <div>
        {#if $taskStore.order.length === 0}
          <p>データはありません</p>
        {:else}
          <ul class="data-table">

            {#each $taskStore.order as taskId}
              <li>
                {$taskStore.data[taskId].charaName}: {$taskStore.data[taskId]
                  .text}
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  * {
    font-weight: normal;
  }

  .container {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 60px;
    color: white;
    background: #afd3af;
    pointer-events: auto;
    z-index: 1;
  }

  .data-table {
  }
</style>
