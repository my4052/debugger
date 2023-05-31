export const urlHistory: { url: string; title: string }[] = [];
const urlHistoryHandlers: (() => void)[] = [];
export const addUrlHistoryListener = (handler: () => void) => {
  urlHistoryHandlers.push(handler);
};
const methods = ['push', 'splice'];
methods.forEach((method: string) => {
  (urlHistory as any)[method] = function (...args: any[]) {
    const original = (Array.prototype as any)[method];
    try {
      return original.apply(this, args);
    } finally {
      urlHistoryHandlers.forEach((handler) => handler());
    }
  }
});
