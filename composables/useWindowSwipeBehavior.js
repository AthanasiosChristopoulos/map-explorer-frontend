import { ref, nextTick, watch } from 'vue';
import { useSwipe } from '@vueuse/core';

export function usePopupSwipeBehavior(popupRef, scrollableRef, touchStartedAt, isVisibleRef, onClose) {
    const isExpanded = ref(false);
    const isScrollable = ref(false);

    const { direction } = useSwipe(popupRef);

    watch(direction, (dir) => {
      if (touchStartedAt.value) return;
      
      if (dir === 'up') isExpanded.value = true;
      if (dir === 'down') {
        if (isExpanded.value) {
          isExpanded.value = false;
        } else {
          if (onClose) onClose();
        }
      }
    });

    watch(isVisibleRef, () => {isExpanded.value = false;});

    return {isExpanded, isScrollable};
}
