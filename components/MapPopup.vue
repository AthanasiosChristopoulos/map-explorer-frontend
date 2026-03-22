<template>
    <Transition :name="isMobile() ? 'mobile' : 'mappopup-animation'">
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
                <div class="mappopup__exit-button" @click.stop="close" v-if="!isMobile()">
                    <Button 
                        :icon="closeIcon"
                        class="fit-content-button"
                        :buttonClass="'button__transparent'"
                        alt="Close Map Popup"
                        style="scale: 0.8;"
                    />
                </div>    
                <div class="mappopup-handle" v-if="isMobile()"></div>

                <div v-if="loading" class="skeleton mappopup__img"></div>

                <img 
                    :src="tour.images.cover"
                    @load="onImageLoad"
                    @error="onImageLoadError"
                    alt="Tour Cover Image"
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

                <!-- Categories -->
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

                <!-- Indoor / Outdoor -->
                <div class="row-layout" style="justify-content: space-between; align-items: center;">
                    <div class="column-layout" style="gap: 0.5rem;">
                        <span class="mappopup__stories-info">{{ tour.stops }} stops / {{ tour.stories }} stories</span>     
                        <Tag
                            :label="tour.isIndoors ? 'Indoors' : 'Outdoors'"
                            :backgroundColor="'#E6EDFF'"   
                            :textColor="'#484C70'"       
                            :small="true" 
                            style="padding: 0.6em 0.8rem;"
                        />
                    </div>

                    <AvatarStack 
                        v-if="tour.availableLanguages" 
                        :items="languageGallery" 
                        :maxVisible="2" 
                        @popover-toggle="updatePopover"
                    />
                    
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
import { Button, Tag, AvatarStack } from 'vue-library';
import arrow_right from '@/assets/icons/arrow-right.svg';
import closeIcon from '@/assets/icons/close-callout.svg';
import { usePinHighlight } from '@/composables/tooltip/usePinHighlight.js';
import { matchCategory } from '@/utils/tourInfo.js'
import { usePopupSwipeBehavior } from '@/composables/usePopupSwipeBehavior.js';
import { languageLabelMap, matchLanguageIcon } from '@/utils/tourInfo.js'
import Bugsnag from '@bugsnag/js';

const isLanguagePopoverOpen = ref(false);
function updatePopover(val) {
    isLanguagePopoverOpen.value = val;
} 

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

const languageGallery = computed(() => {
  return props.tour.availableLanguages.map((lang, index) => ({
    id: index,
    name: languageLabelMap[lang],
    url: matchLanguageIcon(lang)
  }))
})

// Watchers:  ===========================================================================

watch(() => props.tour, () => {
    loading.value = true;
}, { immediate: true });

// Handle Scrolling: ===========================================================================

const popupRef = ref(null);
const scrollableRef = ref(null);
let touchStartedAt = ref(false);
let isExpanded = ref(false);
let isScrollable = ref(false);

({ isExpanded, isScrollable } = usePopupSwipeBehavior(isExpanded, isScrollable, popupRef, scrollableRef, touchStartedAt, tour, isVisibleRef, close));

function close() { 
    isExpanded.value = false; 
    emit('update:isVisible', false);
    usePinHighlight(props.map, -1)
}

function onImageLoad() {loading.value = false;}
function onImageLoadError() {
  Bugsnag.notify(new Error('Cover image failed to load'), event => {
      event.severity = 'warning';
      event.context = 'MapPopup.vue onImageLoadError';
      event.addMetadata('tour', { images: props.tour.images });
  });
}
// Events: ===========================================================================

function handleScrollableTouchStart(event) {
    if(!isScrollable.value) return
    const el = scrollableRef.value;
    touchStartedAt.value = true;
    const isAtTop = el.scrollTop === 0;

    if (!isAtTop) {
        event.stopPropagation();
    } else {
        touchStartedAt.value = false;
    }
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

