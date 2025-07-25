<template>
    <Transition :name="isMobile() ? 'mappopup-mobile' : 'mappopup-animation'">
        <div 
            class="mappopup" 
            v-if="isVisible"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"            
        >
                <div class="mappopup__static">
                    <div class="mappopup__exit-button" @click="exit" v-if="!isMobile()"><img :src="exitIcon" alt="Close"></div>    
                    <div class="mappopup-handle" v-if="isMobile()" @click="isExpanded = !isExpanded"></div>

                    <img 
                        :src="tour.images.cover" 
                        alt="Preview not available" 
                        class="mappopup__img-img" 
                    />

                    <div class="mappopup__header" v-if="title">
                        <h2 :style="{ paddingBottom: isMobile() && !isExpanded ? '1rem' : '0rem' }">{{ title }}</h2>
                        <div v-if="subtitle && (!isMobile() || isExpanded)" class="mappopup__subtitle">{{ subtitle }}</div>
                    </div>

                </div>
            <!--============================= Scrollable element =============================-->
            <div class="mappopup__scrollable" v-if="!isMobile() || isExpanded"
                ref="scrollableRef"
                @touchstart="maybeStopTouch"
                @touchend="maybeStopTouch"
            >

                <div class="mappopup__body">
                    <slot name="mappopup__body" />
                </div>

                <div style="position: relative; display: flex; flex-direction: column; gap: 0.7rem;">
                    <div v-if="categories" style="display: flex; flex-direction: row; gap: 1rem;">
                        <div v-for="(category, idx) in categories" :key="idx">
                            <Tag
                                :label="category.name"
                                :color="matchCategoryColor(category.name)"
                                style="display: flex; flex-direction: row;"
                            ></Tag>
                        </div>
                    </div>
                    <div v-else>
                        <Tag
                            :label="`Uncategorized`"
                            :color="`dark-purple`"
                        ></Tag>
                    </div>
                    
                    <span class="mappopup__stories-info">{{ numberOfStops }} stops / {{ numberOfStories }} stories</span>
                    
                    <Tag 
                        :label="isIndoors ? 'Indoors' : 'Outdoors'"
                        :color="isIndoors ? 'green' : 'purple'"
                    />

                    <div class="mappopup__languageIcon" v-if="availableLanguages">
                        <div v-for="language in availableLanguages.slice(0,2)">
                            <img :src="returnLanguageImage(language)">
                        </div>
                        <div class="mappopup__circle" v-if="availableLanguages.length > 2">
                            <p>+{{ availableLanguages.length - 2 }}</p>    
                        </div>
                    </div>

                </div>

                <div class="mappopup__divider"></div>

                <div class="button__footer">
                    <Button
                        :type="'submit'"
                        :text="`Discover Products`"
                        :buttonClass="'button__light-blue'"
                        :icon="arrow_right"
                        :iconPosition="'right'"
                    />
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { toRef, ref, watch } from 'vue';
import { Button } from 'vue-library';
import arrow_right from '@/assets/icons/arrow-right.svg';
import Tag from '@/components/Tag.vue';

import exitIcon from '../assets/icons/exit.svg';
import en from '../assets/icons/languages/en.svg';
import es from '../assets/icons/languages/es.svg';
import fr from '../assets/icons/languages/fr.svg';
import gr from '../assets/icons/languages/gr.svg';
import it from '../assets/icons/languages/it.svg';
import pt from '../assets/icons/languages/pt.svg';
import de from '../assets/icons/languages/de.svg';

import { isMobile } from '../utils/devices';

let displayed_images = ref([]);
let language_image = ref('');
let isExpanded = ref(false);

const emit = defineEmits(['update:isVisible']);

const title = ref('');
const isIndoors = ref(false);
const numberOfStops = ref('');
const numberOfStories = ref(false);

let categories = ref([]);
let availableLanguages = ref([]);

let touchStartY = 0;
let touchEndY = 0;

const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    subtitle: {
        type: String,
        default: '',
    },
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
    positiveAction: {
        type: Boolean,
        default: false,
    },
    buttonsWidth: {
        type: Number,
        default: 100,
    },
    tour: {
        type: Object,
        default: () => ({}),
    }
});    

const visible = ref(props.isVisible);
watch(() => props.isVisible, val => { 
    visible.value = val; 
    isExpanded.value = false; 
});

function open() { visible.value = true;  emit('update:isVisible', true);  }
function close() { visible.value = false; isExpanded.value = false; emit('update:isVisible', false); }
function toggle() { visible.value = !visible.value; emit('update:isVisible', visible.value); }

const scrollableRef = ref(null);

function isScrollNeeded() {
  const el = scrollableRef.value;
  return el && el.scrollHeight > el.clientHeight;
}

function maybeStopTouch(event) {
  if (isScrollNeeded()) {
    event.stopPropagation();
  }
}

function exit() {
    close();
};

let current_id_popup = ref(-1);

watch(() => props.tour, (newTour) => {
  if (newTour) {togglePopup();}
});

function togglePopup() {
    displayed_images.value = [];
    let tour = props.tour;

    if (current_id_popup.value === tour.id) {
        toggle();
    } else {
        open();
    }

    current_id_popup.value = tour.id;
    title.value = tour.title;
    isIndoors.value = tour.isIndoors;
    numberOfStops.value = tour.stops;
    numberOfStories.value = tour.stories;

    categories.value = tour.categories;

    availableLanguages.value = [...new Set(tour.availableLanguages)]; // avoid language duplication
    if (tour) {

        if(tour.images.cover) {
            displayed_images.value.push(tour.images.cover);
        } else {
            displayed_images.value = [];
        }
    } else {
        console.warn(`Tour with id ${id} not found`);
    }
};

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
        const tappedElement = event.target;
        isExpanded.value = !isExpanded.value;
    }
}

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

