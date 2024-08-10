/**
 * Represents the structure of the event map.
 * Extend this interface to define your custom events.
 */
export type StrictEventMap = {};

/**
 * Represents an event handler function.
 * @template T The type of data the handler receives.
 */
type EventHandler<T> = (data: T) => void | Promise<void>;

/**
 * A type-safe event bus implementation.
 * @template TEventMap The event map type extending StrictEventMap.
 */
export class EventBus<TEventMap extends StrictEventMap> {
  private static instances: Map<string, EventBus<any>> = new Map();
  private handlers: Map<keyof TEventMap, Set<EventHandler<any>>>;

  /**
   * Private constructor to prevent direct instantiation.
   * Use getInstance() to get an EventBus instance.
   */
  private constructor() {
    this.handlers = new Map();
  }

  /**
   * Gets a singleton instance of EventBus for the given key.
   * @param key The key for the EventBus instance. Defaults to 'default'.
   * @returns An instance of EventBus.
   */
  public static getInstance<T extends StrictEventMap>(
    key: string = "default",
  ): EventBus<T> {
    if (!EventBus.instances.has(key)) {
      EventBus.instances.set(key, new EventBus<T>());
    }
    return EventBus.instances.get(key) as EventBus<T>;
  }

  /**
   * Subscribes a handler to the specified event.
   * @param eventName The name of the event to subscribe to.
   * @param handler The handler function to be called when the event is emitted.
   */
  public on<K extends keyof TEventMap>(
    eventName: K,
    handler: EventHandler<TEventMap[K]>,
  ): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    this.handlers.get(eventName)!.add(handler);
  }

  /**
   * Unsubscribes a handler from the specified event.
   * @param eventName The name of the event to unsubscribe from.
   * @param handler The handler function to be removed.
   */
  public off<K extends keyof TEventMap>(
    eventName: K,
    handler: EventHandler<TEventMap[K]>,
  ): void {
    const handlers = this.handlers.get(eventName);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(eventName);
      }
    }
  }

  /**
   * Emits an event with the given name and data.
   * @param eventName The name of the event to emit.
   * @param data The data to be passed to the event handlers.
   * @returns A promise that resolves when all handlers have completed.
   */
  public async emit<K extends keyof TEventMap>(
    eventName: K,
    data: TEventMap[K],
  ): Promise<void> {
    const handlers = this.handlers.get(eventName);
    if (handlers) {
      const promises = Array.from(handlers).map((handler) => handler(data));
      await Promise.all(promises);
    }
  }
}
