<template>
  <div
    class="tooltip-container"
    @mouseover="showTooltip = true"
    @mouseleave="showTooltip = false"
    ref="tooltipContainer"
  >
    <slot name="anchor"></slot>
    <div
      v-if="showTooltip"
      class="tooltip"
      :class="{
        'tooltip--right': align === 'right',
        'tooltip--top': align === 'top',
        'tooltip--left': align === 'left',
        'tooltip--bottom': align === 'bottom',
      }"
      :style="tooltipStyle"
      ref="tooltip"
    >
      <slot name="tooltip-content"></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue';

export default defineComponent({
  name: 'Tooltip',
  props: {
    align: {
      default: 'right',
      type: String,
      validator: (value) => ['right', 'top', 'left', 'bottom', 'over'].includes(value),
    },
  },
  setup(props) {
    const showTooltip = ref(false);
    const tooltipContainer = ref(null);
    const tooltip = ref(null);
    const tooltipStyle = ref({});

    const updateTooltipPosition = () => {
      if (!tooltipContainer.value || !tooltip.value) return;

      const containerRect = tooltipContainer.value.getBoundingClientRect();
      const tooltipRect = tooltip.value.getBoundingClientRect();

      let top, left;

      switch (props.align) {
        case 'right':
          top = containerRect.top;
          left = containerRect.right + 4;
          break;
        case 'left':
          top = containerRect.top;
          left = containerRect.left - tooltipRect.width - 4;
          break;
        case 'top':
          top = containerRect.top - tooltipRect.height - 4;
          left = containerRect.left;
          break;
        case 'bottom':
          top = containerRect.bottom + 4;
          left = containerRect.right;
          break;
        case 'over':
          top = containerRect.top;
          left = containerRect.left;
          break;
      }

      tooltipStyle.value = {
        top: `${top}px`,
        left: `${left}px`,
      };
    };

    watch(showTooltip, (newValue) => {
      if (newValue) {
        // Wait for the tooltip to be rendered
        setTimeout(updateTooltipPosition, 0);
      }
    });

    onMounted(() => {
      window.addEventListener('scroll', updateTooltipPosition);
      window.addEventListener('resize', updateTooltipPosition);
    });

    return {
      showTooltip,
      align: props.align,
      tooltipContainer,
      tooltip,
      tooltipStyle,
    };
  },
});
</script>