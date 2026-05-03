// JavaScript sample: classes, regex, symbols, promises, and object literals
const LEVELS = /** @type {const} */ (["debug", "info", "warn", "error"]);
const tokenPattern = /^(?<prefix>[A-Z]{2})-(?<id>\d{4,})$/u;

export class EventBus {
  #listeners = new Map();
  static version = "1.0.0";

  on(eventName, listener) {
    const listeners = this.#listeners.get(eventName) ?? new Set();
    listeners.add(listener);
    this.#listeners.set(eventName, listeners);
    return () => listeners.delete(listener);
  }

  async emit(eventName, payload = {}) {
    for (const listener of this.#listeners.get(eventName) ?? []) {
      await listener({ eventName, payload, at: new Date().toISOString() });
    }
  }
}

export function parseToken(value) {
  const match = tokenPattern.exec(value.trim());
  if (!match?.groups) throw new TypeError(`Invalid token: ${value}`);

  return {
    prefix: match.groups.prefix,
    id: Number(match.groups.id),
    [Symbol.toStringTag]: "ParsedToken",
  };
}

LEVELS.forEach((level, index) => console.log(index, level));
