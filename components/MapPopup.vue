<template>
    <Transition :name="isMobile ? 'mappopup-mobile' : 'mappopup-animation'">
        <div 
            class="mappopup column-layout"
            v-if="props.isVisible"
            ref="popupRef"
            @click="isExpanded = !isExpanded"
            @mouseenter="props.closeTooltip"          
        >
            <!--============================= static element, Image, Title, Author =====================-->

            <div class="mappopup__static column-layout" style="padding-top: 1.5rem;">
                <div class="mappopup__exit-button" @click.stop="close" v-if="!isMobile"><img :src="exitIcon" alt="Close"></div>    
                <div class="mappopup-handle" v-if="isMobile" @click="isExpanded = !isExpanded"></div>

                <img :src="tour.images.cover" alt="Preview not available" class="mappopup__img"/>

                <div class="mappopup__header column-layout" v-if="tour.title">
                    <h2>{{ tour.title }}</h2>
                    <div v-if="authorNames && (!isMobile || isExpanded)" class="mappopup__author">{{ authorNames }}</div>
                </div>
            </div>

            <!--============================= Scrollable element =============================-->

            <div class="mappopup__scrollable column-layout" v-if="(!isMobile || isExpanded)"
                ref="scrollableRef"
                @touchstart="maybeStopTouchPropagation"
                @touchend="maybeStopTouchPropagation"
                :style="{ paddingRight: isScrollable ? '1rem' : '1.5rem' }"
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
                            style="display: flex; flex-direction: row;"
                        ></Tag>
                    </div>
                </div>
                <div v-else>
                    <Tag
                        :label="`Uncategorized`"
                        :backgroundColor="'#484C70'"  
                        :textColor="'#ffffff'"       
                    ></Tag>
                </div>
                        
                <div class="row-layout" style="justify-content: space-between;">
                    <div class="column-layout" style="gap: 0.5rem;">
                        <span class="mappopup__stories-info">{{ tour.stops }} stops / {{ tour.stories }} stories</span>
                        
                        <Tag
                            :label="tour.isIndoors ? 'Indoors' : 'Outdoors'"
                            :backgroundColor="tour.isIndoors ? '#D7F9DA' : '#E6EDFF'"   
                            :textColor="tour.isIndoors ? '#39B54A' : '#484C70'"        
                        />

                    </div>
                    <div class="mappopup__languageIcon" v-if="tour.availableLanguages">
                        <div v-for="language in tour.availableLanguages.slice(0,2)">
                            <img :src="returnLanguageImage(language)">
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
import { ref, watch, computed, nextTick } from 'vue';
import { useSwipe } from '@vueuse/core'
import { Button, Tag } from 'vue-library';
import arrow_right from '@/assets/icons/arrow-right.svg';

import exitIcon from '../assets/icons/exit.svg';
import en from '../assets/icons/languages/en.svg';
import es from '../assets/icons/languages/es.svg';
import fr from '../assets/icons/languages/fr.svg';
import gr from '../assets/icons/languages/gr.svg';
import it from '../assets/icons/languages/it.svg';
import pt from '../assets/icons/languages/pt.svg';
import de from '../assets/icons/languages/de.svg';

import { useWindowSize } from '@vueuse/core';
import { changePinIcon } from '@/composables/useTooltip.js';

const { width } = useWindowSize();
const isMobile = computed(() => width.value <= 768);

let isExpanded = ref(false);

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
    }
});    

watch(() => props.isVisible, () => { isExpanded.value = false; });

const tour = computed(() => props.tour);

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

function close() { 
    isExpanded.value = false; 
    emit('update:isVisible', false);
    changePinIcon(-1); 
}

// Handle Swiping for Mobile =====================================================================

const popupRef = ref(null)
const { direction } = useSwipe(popupRef)
watch(direction, (dir) => {
  if (dir === 'up') isExpanded.value = true
  if (dir === 'down') {
    if(isExpanded.value) isExpanded.value = false;
    else close();
  }
})

// Handle Swiping for Scrollable  =====================================================================

const scrollableRef = ref(null);
const isScrollable = ref(false);
watch(() => props.tour, async () => {
  await nextTick();
  const el = scrollableRef.value;
  if (el) isScrollable.value = el.scrollHeight > el.clientHeight;
});
function maybeStopTouchPropagation(event) {
  if (isScrollable.value) event.stopPropagation();
  
}


function matchCategoryColors(category_name) {
  switch (category_name) {
    case "History":
      return { backgroundColor: '#F2AF29', textColor: '#ffffff' };
    case "Gastronomy":
      return { backgroundColor: '#AD343E', textColor: '#ffffff' };
    case "Nature":
      return { backgroundColor: '#5296A5', textColor: '#ffffff' };
    case "Museum":
      return { backgroundColor: '#FB902D', textColor: '#ffffff' };
    case "Adventure":
      return { backgroundColor: '#2EA7CE', textColor: '#ffffff' };
    case "Art":
      return { backgroundColor: '#EAA2A8', textColor: '#ffffff' };
    default:
      return { backgroundColor: '#484C70', textColor: '#ffffff' };
  }
}

const languageMap = {it, en, pt, es, fr, de, gr,};

function returnLanguageImage(language) {
  return languageMap[language] || gr;
}

</script>

