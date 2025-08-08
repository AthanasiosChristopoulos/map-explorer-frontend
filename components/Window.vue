<template>
    <transition name="window-animation">
        <div :class="isMobile() ? '' : 'window-container'"
            v-if="isExpanded" 
            ref="popupRef" 
            @click="closeIfOnMobile"
            @touchstart="touchStartedAt = false"
        >
            <transition name="window-animation-inner">
                    <div class="window">
                        <img 
                            v-if="!isMobile()"
                            class="window__close-icon" 
                            :src="closeIcon" 
                            @click="$emit('close')"
                        />
                        <div class="window__header column-layout">
                            <div class="mappopup-handle" v-if="isMobile()"></div>

                            <slot name="window__header" />
                        </div>
                        <div 
                            class="window__body" 
                            ref="scrollableRef"
                            @touchstart="handleScrollableTouchStart"
                            @touchend.stop
                            @click.stop   
                        >
                            <slot name="window__body" />
                        </div>
                        <div class="window__footer">
                            <Button
                                :type="'reset'"
                                :text="leftButtonText" 
                                :buttonClass="'button__white left extra-padding'" 
                                :isDisabled="leftButtonDisabled" 
                                @click="$emit('left-action')"
                            />
                            <Button 
                                :type="'submit'"
                                :text="rightButtonText" 
                                :buttonClass="'button__green right'" 
                                :icon="rightButtonDisabled ? checkedDisabledIcon : checkedIcon" 
                                :iconPosition="'right'" 
                                :isDisabled="rightButtonDisabled" 
                                @click="$emit('right-action')"
                            />
                        </div>
                    </div>

            </transition>
        </div>
    </transition>
</template>

<script setup>
import { provide } from 'vue';
import { Button } from 'vue-library';
import closeIcon from '@/node_modules/vue-library/src/assets/icons/close-callout.svg';
import checkedIcon from '@/node_modules/vue-library/src/assets/icons/checked.svg';
import checkedDisabledIcon from '@/node_modules/vue-library/src/assets/icons/checked-disabled.svg';
import { usePopupSwipeBehavior } from '@/composables/usePopupSwipeBehavior.js';

const props = defineProps({
    leftButtonText: {
        type: String,
        default: '',
    },
    rightButtonText: {
        type: String,
        default: '',
    },
    isVisible: {
        type: Boolean,
        default: false,
    },
    leftButtonDisabled: {
        type: Boolean,
        default: false,
    },
    rightButtonDisabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close', 'left-action', 'right-action', 'update:isVisible'])

const emitClose = () => emit('close');

function closeIfOnMobile() {
    if(!isMobile()) return
    emitClose();
}

// Handle Scrolling: ===========================================================================

const isMobile = () => window.innerWidth <= 768;
const popupRef = ref(null);
const scrollableRef = ref(null);
let touchStartedAt = ref(false);

const isExpanded = computed({
  get: () => props.isVisible,
  set: (val) => emit('update:isVisible', val)
});

usePopupSwipeBehavior(isExpanded, null, popupRef, scrollableRef, touchStartedAt, null, null, null);

function scrollFullyDown() {
    nextTick(() => {
        const el = scrollableRef.value;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    });
}

provide('scrollFullyDown', scrollFullyDown);

// Events: ====================================================================================

function handleScrollableTouchStart(event) {
    const el = scrollableRef.value;
    touchStartedAt.value = true;
    const isAtTop = el.scrollTop === 0;  // number of pixels that the content has been scrolled vertically from the top.
    if (!isAtTop) {
        event.stopPropagation();
    } else {
        touchStartedAt.value = false;
    }
}


</script>