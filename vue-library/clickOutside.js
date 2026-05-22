const listeners = new WeakMap();

export default {
  mounted(el, binding) {
    const handler = (event) => {
      if (!el.contains(event.target)) {
        if (typeof binding.value === 'function') {
          binding.value(event);
        }
      }
    };

    listeners.set(el, handler);
    document.addEventListener('click', handler);
    document.addEventListener('touchstart', handler);
  },

  unmounted(el) {
    const handler = listeners.get(el);
    if (handler) {
      document.removeEventListener('click', handler);
      document.removeEventListener('touchstart', handler);
      listeners.delete(el);
    }
  },
};