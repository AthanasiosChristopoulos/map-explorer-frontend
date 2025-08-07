<template>
    <Transition :name="isMobile() ? 'mappopup-mobile' : 'mappopup-animation'">
        <div 
            class="mappopup column-layout"
            :class="{'mappopup--overflow': isScrollable}"
            v-if="isVisibleRef"
            ref="popupRef"
            @touchstart="!isLanguagePopoverOpen && (touchStartedAt = false)"
            @click="!isLanguagePopoverOpen && (isExpanded = !isExpanded)"
            @mouseenter="props.closeTooltip"          
        >
            <!--============================= static element, Image, Title, Author =====================-->

            <div class="mappopup__static column-layout" style="padding-top: 1.5rem;">
                <div class="mappopup__exit-button" @click.stop="close" v-if="!isMobile()"><img :src="exitIcon" alt="Close"></div>    
                <div class="mappopup-handle" v-if="isMobile()"></div>

                <div v-if="loading" class="skeleton mappopup__img"></div>
                <img 
                    :src="tour.images.cover"
                    @load="handleImageLoad"
                    alt="Preview not available"
                    class="mappopup__img"
                    :class="{ 'hidden': loading }"
                />
                
                <div class="mappopup__header column-layout" v-if="tour.title">
                    <h2>{{ tour.title }}</h2>
                    <div v-if="authorNames && (!isMobile() || isExpanded)" class="mappopup__author">{{ authorNames }}</div>
                </div>
            </div>

            <!--============================= Scrollable element =============================-->

            <div class="mappopup__scrollable column-layout" v-if="(!isMobile() || isExpanded)"
                ref="scrollableRef"
                @touchstart="handleScrollableTouchStart"
                @touchend="handleScrollableTouchEnd"
                @click="handleScrollableClick"
                :class="{ 'mappopup__scrollable--overflow': isScrollable}"
            >

                <div class="mappopup__body" v-if="tour.description ">
                    {{ tour.description }}
                </div>

                <div v-if="tourCategories" class="row-layout" style="gap: 1rem; overflow-x: auto; flex-shrink: 0;">
                    <div v-for="(category, idx) in tourCategories" :key="idx">
                        <Tag
                            :label="category.name"
                            :backgroundColor="category.backgroundColor"
                            :textColor="category.textColor"
                            :small="true"
                            style="display: flex; flex-direction: row; padding: 0.6em 0.8rem;"
                        />
                    </div>
                </div>
                <div v-else>
                    <Tag
                        :label="`Uncategorized`"
                        :backgroundColor="'#484C70'"  
                        :textColor="'#ffffff'" 
                        :small="true"
                    />
                </div>
                        
                <div class="row-layout" style="justify-content: space-between;">
                    <div class="column-layout" style="gap: 0.5rem;">
                        <span class="mappopup__stories-info">{{ tour.stops }} stops / {{ tour.stories }} stories</span>     
                        <Tag
                            :label="tour.isIndoors ? 'Indoors' : 'Outdoors'"
                            :backgroundColor="tour.isIndoors ? '#D7F9DA' : '#E6EDFF'"   
                            :textColor="tour.isIndoors ? '#39B54A' : '#484C70'"       
                            :small="true" 
                            style="padding: 0.6em 0.8rem;"
                        />
                    </div>
          
                    <LanguageGallery v-if="tour.availableLanguages" :languages="tour.availableLanguages" @popover-toggle="updatePopover"/>

                </div>
            </div>

            <!--============================= CTA element =============================-->

            <div class="mappopup__static column-layout" style="padding-top: 0px;" v-if="!isMobile() || isExpanded">
                <div class="divider" style="margin: 0rem -1.5rem 0rem -1.5rem;"></div>

                <div class="button__footer">
                    <Button
                        :type="'submit'"
                        :text="`Discover Products`"
                        :buttonClass="'button__light-blue'"
                        :icon="arrow_right"
                        :iconPosition="'right'"
                        style="background: #43ABFF;"
                    />
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Button, Tag } from 'vue-library';

import arrow_right from '@/assets/icons/arrow-right.svg';
import exitIcon from '../assets/icons/exit.svg';

import { usePinHighlight } from '@/composables/tooltip/usePinHighlight.js';
import { matchCategory } from '@/utils/mapPopupUtils.js'
import { usePopupSwipeBehavior } from '@/composables/usePopupSwipeBehavior.js';

import LanguageGallery from '@/components/LanguageGallery.vue';

const isLanguagePopoverOpen = ref(false);
const updatePopover = (val) => isLanguagePopoverOpen.value = val;

const isMobile = () => window.innerWidth <= 768;
const loading = ref(true);

const emit = defineEmits(['update:isVisible']);

const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false,
    },
    tour: {
        type: Object,
        default: () => ({}),
    }, 
    closeTooltip: {
        type: Function,
        default: null
    },
    map: Object
});    

// Computed Properties: ===========================================================================

const tour = computed(() => props.tour);
const isVisibleRef = computed(() => props.isVisible);
const tourCategories = computed(() => {
  return props.tour.categories?.map(cat => {
    const { backgroundColor, textColor } = matchCategory(cat.name);
    return { ...cat, backgroundColor, textColor };
  }) || [];
});

const authorNames = computed(() => {
  const authors = props.tour.author;
  if(Array.isArray(authors)) {
    return authors.map(a => a.name).join(', ');
  } else {
    return authors.name
  }
});

// Watchers:  ===========================================================================

watch(() => props.tour, () => {
    loading.value = true;
}, { immediate: true });

// Handle Scrolling: ===========================================================================

const popupRef = ref(null);
const scrollableRef = ref(null);
let touchStartedAt = ref(false);

const { isExpanded, isScrollable } = usePopupSwipeBehavior(popupRef, scrollableRef, touchStartedAt, tour, isVisibleRef, close);

function close() { 
    isExpanded.value = false; 
    emit('update:isVisible', false);
    usePinHighlight(props.map, -1)
}

function handleImageLoad() {loading.value = false;}

// Events: ===========================================================================

function handleScrollableTouchStart(event) {
    if(!isScrollable.value) return
    touchStartedAt.value = true;
    event.stopPropagation();
}

function handleScrollableTouchEnd(event) {
    if(!isScrollable.value) return
    event.stopPropagation();
}

function handleScrollableClick(event) {
    if(!isScrollable.value) return
    if (!isLanguagePopoverOpen) {
        event.stopPropagation();
    }
}

</script>

