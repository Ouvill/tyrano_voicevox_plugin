import { SpeechTask } from "../models/speech-task.ts";
import { writable } from "svelte/store";
import { produce } from "immer";

type TaskId = number;

type TaskMemoryStore = {
  data: Record<TaskId, SpeechTask>;
  order: TaskId[];
};

const initialData: TaskMemoryStore = { data: {}, order: [] };

function djb2Hash(str: string) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << (5 + hash)) + str.charCodeAt(i);
    hash = hash & 0xffffffff;
  }
  return hash >>> 0;
}

function createTaskStore() {
  const { subscribe, update } = writable<TaskMemoryStore>(initialData);

  function generateTaskId(task: SpeechTask): TaskId {
    const taskString = JSON.stringify(task);
    return djb2Hash(taskString);
  }

  function addTask(task: SpeechTask) {
    const taskId = generateTaskId(task);
    update((state) =>
      produce(state, (draft) => {
        if (!draft.data[taskId]) {
          draft.data[taskId] = task;
        }
        draft.order.push(taskId);
      }),
    );
  }

  function getTask(index: number): SpeechTask | undefined {
    let result: SpeechTask | undefined;
    subscribe((state) => {
      const taskId = state.order[index];
      result = state.data[taskId];
    })();
    return result;
  }

  return {
    subscribe,
    addTask,
    getTask,
  };
}

export const taskStore = createTaskStore();
