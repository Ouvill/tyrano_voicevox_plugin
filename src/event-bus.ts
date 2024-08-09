// Strict event map type
export type StrictEventMap = {};
// Event handler type
type EventHandler<T> = (data: T) => void | Promise<void>;

export class EventBus<TEventMap extends StrictEventMap> {
    private static instances: Map<string, EventBus<any>> = new Map();
    private handlers: Map<keyof TEventMap, Set<EventHandler<any>>>;

    private constructor() {
        this.handlers = new Map();
    }

    public static getInstance<T extends StrictEventMap>(key: string = 'default'): EventBus<T> {
        if (!EventBus.instances.has(key)) {
            EventBus.instances.set(key, new EventBus<T>());
        }
        return EventBus.instances.get(key) as EventBus<T>;
    }

    public on<K extends keyof TEventMap>(eventName: K, handler: EventHandler<TEventMap[K]>): void {
        if (!this.handlers.has(eventName)) {
            this.handlers.set(eventName, new Set());
        }
        this.handlers.get(eventName)!.add(handler);
    }

    public off<K extends keyof TEventMap>(eventName: K, handler: EventHandler<TEventMap[K]>): void {
        const handlers = this.handlers.get(eventName);
        if (handlers) {
            handlers.delete(handler);
            if (handlers.size === 0) {
                this.handlers.delete(eventName);
            }
        }
    }

    public async emit<K extends keyof TEventMap>(eventName: K, data: TEventMap[K]): Promise<void> {
        const handlers = this.handlers.get(eventName);
        if (handlers) {
            const promises = Array.from(handlers).map(handler => handler(data));
            await Promise.all(promises);
        }
    }
}
