import { createContext, useContext } from 'react';

type EventCallback = () => void;

export class EventEmitter {
  private listeners: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return cleanup function
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  emit(event: string) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback());
    }
  }
}

export const eventEmitter = new EventEmitter();

// Event names
export const TRANSACTION_UPDATED = 'transaction:updated';

// React Context
export const EventEmitterContext = createContext<EventEmitter>(eventEmitter);

// React Hook
export const useEventEmitter = () => useContext(EventEmitterContext);
