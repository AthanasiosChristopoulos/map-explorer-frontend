import { ref    , nextTick, watch } from 'vue';
import { useSwipe } from '@vueuse/core';

export function usePopupSwipeBehavior(popupRef, scrollableRef, tourRef, isVisibleRef, onClose) {
  const isExpanded = ref(false);
  const isScrollable = ref(false);

  const { direction } = useSwipe(popupRef);

  watch(direction, (dir) => {
    if (dir === 'up') isExpanded.value = true;
    if (dir === 'down') {
      if (isExpanded.value) {
        isExpanded.value = false;
      } else {
        if (onClose) onClose();
      }
    }
  });

  watch(tourRef, async () => {
    await nextTick();
    const el = scrollableRef.value;
    if (el) {
      isScrollable.value = el.scrollHeight > el.clientHeight;
    }
  }, { immediate: true });

  watch(isVisibleRef, () => {isExpanded.value = false;});

  function maybeStopTouchPropagation(event) {
    if (isScrollable.value) event.stopPropagation();
  }

  return {
    isExpanded,
    isScrollable,
    maybeStopTouchPropagation
  };
}
