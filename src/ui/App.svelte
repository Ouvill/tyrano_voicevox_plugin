<script lang="ts">
  import { isDevOpen } from "./store.ts";
  import { fade, fly } from "svelte/transition";
  import { taskStore } from "./task-store.ts";
  import { SpeechDownloader } from "../models/downloader.ts";
  import { get } from "svelte/store";
  import { AbortError } from "../models/abort-error.ts";

  // ティラノスクリプトはlayer_menuのクラスのstyleが`display: none`以外の時イベントを実行しない。
  const disable_tyrano_event_class = "layer_menu";

  let controller = new AbortController();
  let generating = false;
  let progress = 0;

  const handleDownload = async () => {
    generating = true;
    try {
      const taskData = get(taskStore);
      const taskIds = [...new Set(taskData.order)];
      const tasks = taskIds.map((id) => taskData.data[id]);
      if (tasks.length === 0) {
        return;
      }

      const signal = controller.signal;
      signal.addEventListener("abort", () => {
        controller = new AbortController();
        throw new AbortError("downlaod aborted");
      });

      const downloader = new SpeechDownloader();
      const zip = await downloader.generateZipFile(tasks, signal, (p) => {
        progress = p;
      });

      const url = URL.createObjectURL(zip);
      const a = document.createElement("a");
      a.href = url;
      a.download;
      a.click();
      taskStore.removeTasks(taskIds);
      URL.revokeObjectURL(url);
    } finally {
      generating = false;
      progress = 0;
    }
  };
</script>

{#if $isDevOpen}
  <div
    class="container {disable_tyrano_event_class}"
    transition:fly={{ y: 200, duration: 300 }}
  >
    <div class="content" in:fade={{ duration: 300, delay: 300 }}>
      <h1>VOICEVOX管理UI</h1>

      <div class="table-container">
        {#if $taskStore.order.length === 0}
          <p class="no-data">生成した音声データはありません</p>
        {:else}
          <table class="data-table">
            <thead>
              <tr>
                <th>キャラクター名</th>
                <th>テキスト</th>
              </tr>
            </thead>
            <tbody>
              {#each $taskStore.order as taskId}
                <tr>
                  <td>{$taskStore.data[taskId].charaName}</td>
                  <td>{$taskStore.data[taskId].text}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
      <div class="download-container">
        <div>
          <p>音声をダウンロードする</p>
          <small
            >ダウンロードした音声は解凍して<code>data/sound/voicevox</code
            >に配置してください</small
          >
        </div>

        {#if generating}
          <div>
            <p>{(progress * 100).toFixed(2)}%</p>
          </div>
        {/if}

        <button disabled={generating} on:click={handleDownload}
          >ダウンロード
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  * {
    font-family: Arial, sans-serif;
    box-sizing: border-box;
  }

  .container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: block;
    background: rgba(175, 211, 175, 0.95);
    color: #333;
    pointer-events: auto;
    z-index: 1;
    overflow: hidden;
  }

  .content {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  h1 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 20px;
  }

  .table-container {
    flex: 1;
    overflow-y: auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table th,
  .data-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  .data-table th {
    background-color: #f5f5f5;
    font-weight: bold;
    color: #2c3e50;
  }

  .data-table tr:hover {
    background-color: #f0f0f0;
  }

  .no-data {
    text-align: center;
    padding: 20px;
    color: #777;
  }

  .download-container {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
  }
</style>
