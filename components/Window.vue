<template>
    <transition name="window-animation">
        <div v-if="isVisible">
            <transition name="window-animation-inner">
                <!-- <div class="window"> -->
                <div :class="isMobile() ? '' : 'window-container'">
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
                        <div class="window__body">
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

                </div>
            </transition>
        </div>
    </transition>
</template>

<script setup>
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
const emit = defineEmits(['close', 'left-action', 'right-action'])

// Reactive data for icons
const closeIconUrl = closeIcon;
const checkedIconUrl = checkedIcon;
const checkedDisabledIconUrl = checkedDisabledIcon;

// Emitting actions
const emitClose = () => emit('close');
const emitLeftAction = () => emit('left-action');
const emitRightAction = () => emit('right-action');

const isMobile = () => window.innerWidth <= 768;

const { isExpanded, isScrollable } = usePopupSwipeBehavior(popupRef, scrollableRef, touchStartedAt, tour, isVisibleRef, close);



</script>