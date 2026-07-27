export const MEMORY_UPDATED_EVENT = "memory-updated";

export function notifyMemoryUpdated() {
  window.dispatchEvent(
    new Event(MEMORY_UPDATED_EVENT)
  );
}

export function subscribeMemoryUpdated(callback) {
  window.addEventListener(
    MEMORY_UPDATED_EVENT,
    callback
  );

  return () =>
    window.removeEventListener(
      MEMORY_UPDATED_EVENT,
      callback
    );
}