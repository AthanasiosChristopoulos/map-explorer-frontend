<template>
    <Transition :name="isMobile() ? 'mappopup-mobile' : 'mappopup-animation'">
        <div 
            class="mappopup column-layout" 
            v-if="props.isVisible"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"  
            @mouseenter="closeTooltip"          
        >
            <!--============================= static element, Image, Title, Author =====================-->
            <div class="mappopup__static column-layout">
                <div class="mappopup__exit-button" @click="close" v-if="!isMobile()"><img :src="exitIcon" alt="Close"></div>    
                <div class="mappopup-handle" v-if="isMobile()" @click="isExpanded = !isExpanded"></div>

                <img :src="tour.images.cover" alt="Preview not available" class="mappopup__img"/>

                <div class="mappopup__header column-layout" v-if="tour.title">
                    <h2 :style="{ paddingBottom: isMobile() && !isExpanded ? '1rem' : '0rem' }">{{ tour.title }}</h2>
                    <div v-if="authorNames && (!isMobile() || isExpanded)" class="mappopup__author">{{ authorNames }}</div>
                </div>
            </div>

            <!--============================= Scrollable element =============================-->

            <div class="mappopup__scrollable column-layout" v-if="(!isMobile() || isExpanded) && true"
                ref="scrollableRef"
                @touchstart="maybeStopTouchPropagation"
                @touchend="maybeStopTouchPropagation"
            >

                <div class="mappopup__body" v-if="tour.description ">
                    {{ tour.description }}
                </div>

                <div style="position: relative; display: flex; flex-direction: column; gap: 0.7rem;">
                    <div v-if="tour.categories" style="display: flex; flex-direction: row; gap: 1rem;">
                        <div v-for="(category, idx) in tour.categories" :key="idx">
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
                    
                    <span class="mappopup__stories-info">{{ tour.stops }} stops / {{ tour.stories }} stories</span>
                    
                    <Tag
                        :label="tour.isIndoors ? 'Indoors' : 'Outdoors'"
                        :backgroundColor="tour.isIndoors ? '#03a481' : '#E6EDFF'"   
                        :textColor="tour.isIndoors ? '#ffffff' : '#484C70'"        
                    />

                    <div class="mappopup__languageIcon" v-if="tour.availableLanguages">
                        <div v-for="language in tour.availableLanguages.slice(0,2)">
                            <img :src="returnLanguageImage(language)">
                        </div>
                        <div class="mappopup__circle" v-if="tour.availableLanguages.length > 2">
                            <p>+{{ tour.availableLanguages.length - 2 }}</p>    
                        </div>
                    </div>

                </div>

            </div>

            <!--============================= CTA element =============================-->

            <div class="mappopup__static column-layout" style="padding-top: 0px;" v-if="!isMobile() || isExpanded">
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
import { ref, watch } from 'vue';
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

import { isMobile } from '../utils/devices';
import { closeTooltip, changePinIcon } from '@/composables/useTooltip.js';

let isExpanded = ref(false);

const emit = defineEmits(['update:isVisible']);

let tour = ref({});
let authorNames = ref(null);

let touchStartY = 0;
let touchEndY = 0;

const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false,
    },
    tour: {
        type: Object,
        default: () => ({}),
    }
});    


watch(() => props.isVisible, () => { 
    isExpanded.value = false; 
});

function close() { 
    isExpanded.value = false; 
    emit('update:isVisible', false);
    changePinIcon(-1); 
}

const scrollableRef = ref(null);
function isScrollNeeded() {
  const el = scrollableRef.value;
  return el && el.scrollHeight > el.clientHeight;
}
function maybeStopTouchPropagation(event) {
  if (isScrollNeeded()) {
    event.stopPropagation();
  }
}

function onTouchStart(event) {
    touchStartY = event.changedTouches[0].screenY;
    event.preventDefault();   
    event.stopPropagation();  
}
function onTouchEnd(event) {
    touchEndY = event.changedTouches[0].screenY;
    const diffY = touchStartY - touchEndY;
    const isSwipe = Math.abs(diffY) > 50;
    const isTap = Math.abs(diffY) < 10;

    if (isSwipe) {
        if(diffY < 0 && !isExpanded.value) {
            close();
        } else {
            isExpanded.value = diffY > 0;
        }
    } else if (isTap) {
        isExpanded.value = !isExpanded.value;
    }
}

watch(() => props.tour, (newTour) => {
  if (newTour) {
        tour.value = newTour;
        if (Array.isArray(tour.value.author)) {
            authorNames.value = tour.value.author.map(a => a.name).join(', ');
        } else {
            authorNames.value = tour.value.author.name;
        }

        tour.value.categories.forEach(cat => {
            const colors = matchCategoryColors(cat.name);
            cat.backgroundColor = colors.backgroundColor;
            cat.textColor = colors.textColor;
        });
        console.log(tour.value.categories)
    }
});

function matchCategoryColor(category_name) {
    switch (category_name) {
        case "History":
            return 'gold';
        case 'Gastronomy':
            return 'red';
        case 'Nature':
            return `dark-green`;
        case 'Museum':
            return `orange`;
        case 'Adventure':
            return `blue`;
        case 'Art':
            return `pink`;
        default:
            return 'dark-purple';
    }
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

function returnLanguageImage(language) {
    switch (language) {
        case 'it':
            return it;
        case 'en':
            return en
        case 'pt':
            return pt
        case 'es':
            return es
        case 'fr':
            return fr    
        case 'de':
            return de   
        case 'gr':
            return gr
        default:
            return gr;
    }
}

</script>

