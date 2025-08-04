<template>
    <Transition :name="isMobile ? 'mappopup-mobile' : 'mappopup-animation'">
        <div 
            class="mappopup column-layout"
            :class="{'mappopup--overflow': isScrollable}"
            v-if="props.isVisible"
            ref="popupRef"
            @touchstart="touchStartedAt = false"
            @click="isExpanded = !isExpanded"
            @mouseenter="props.closeTooltip"          
        >
            <!--============================= static element, Image, Title, Author =====================-->

            <div class="mappopup__static column-layout" style="padding-top: 1.5rem;">
                <div class="mappopup__exit-button" @click.stop="close" v-if="!isMobile"><img :src="exitIcon" alt="Close"></div>    
                <div class="mappopup-handle" v-if="isMobile" @click="isExpanded = !isExpanded"></div>

                <div class="mappopup__img-wrapper">
                    <div v-if="loading" class="spinner"></div>
                    <img 
                        :src="tour.images.cover"
                        @load="handleImageLoad"
                        alt="Preview not available"
                        class="mappopup__img"
                        :class="{ 'hidden': loading }"
                    />
                </div>
                
                <div class="mappopup__header column-layout" v-if="tour.title">
                    <h2>{{ tour.title }}</h2>
                    <div v-if="authorNames && (!isMobile || isExpanded)" class="mappopup__author">{{ authorNames }}</div>
                </div>
            </div>

            <!--============================= Scrollable element =============================-->

            <div class="mappopup__scrollable column-layout" v-if="(!isMobile || isExpanded)"
                ref="scrollableRef"
                @touchstart.stop="touchStartedAt = true"
                @touchend.stop
                @click.stop
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
                    <div class="mappopup__languageIcon" v-if="tour.availableLanguages">
                        <div v-for="language in tour.availableLanguages.slice(0,2)">
                            <img :src="matchLanguageIcon(language)">
                        </div>
                        <div class="mappopup__circle" v-if="tour.availableLanguages.length > 2">
                            +{{ tour.availableLanguages.length - 2 }}
                        </div>
                    </div>
                </div>
            </div>

            <!--============================= CTA element =============================-->

            <div class="mappopup__static column-layout" style="padding-top: 0px;" v-if="!isMobile || isExpanded">
                <div class="mappopup__divider"></div>

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
import { ref, computed, onMounted } from 'vue';
import { Button, Tag } from 'vue-library';

import arrow_right from '@/assets/icons/arrow-right.svg';
import exitIcon from '../assets/icons/exit.svg';

import { useWindowSize } from '@vueuse/core';
import { usePinHighlight } from '@/composables/tooltip/usePinHighlight.js';
import { matchCategoryColors, matchLanguageIcon } from '@/utils/mapPopupUtils.js'
import { usePopupSwipeBehavior } from '@/composables/usePopupSwipeBehavior.js';

const { width } = useWindowSize();
const isMobile = computed(() => width.value <= 768);
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
    const { backgroundColor, textColor } = matchCategoryColors(cat.name);
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

</script>

