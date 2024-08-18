import {generateTaskId, SpeechTask} from "../models/speech-task.ts";
import { writable } from "svelte/store";
import { produce } from "immer";

type TaskId = string;

type TaskMemoryStore = {
  data: Record<TaskId, SpeechTask>;
  order: TaskId[];
};

const initialData: TaskMemoryStore = { data: {}, order: [] };

function removeElement<T>(a: T[], b: T[]) {
  return a.filter((element) => !b.includes(element));
}

function createTaskStore() {
  const { subscribe, update } = writable<TaskMemoryStore>(initialData);

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

  function removeTask(index: number) {
    update((state) =>
      produce(state, (draft) => {
        const removedTaskId = draft.order.splice(index, 1)[0];

        if (!draft.order.includes(removedTaskId)) {
          delete draft.data[removedTaskId];
        }
      }),
    );
  }

  function removeTasks(ids: string[]) {
    update((state) =>
      produce(state, (draft) => {
        draft.order = removeElement(draft.order, ids);
        ids.forEach((id) => {
          delete draft.data[id];
        });
      }),
    );
  }

  return {
    subscribe,
    addTask,
    getTask,
    removeTask,
    removeTasks,
  };
}

export const taskStore = createTaskStore();
