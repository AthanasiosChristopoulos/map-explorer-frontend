<template>
    <div class="gallery__img" v-if="current_image">
        <img 
            :src="current_image" 
            alt="Preview not available" 
            class="gallery__img-img" 
        />
        <button class="gallery__exit-button" @click="exit" v-if="!isMobile"><img :src="exitIcon" alt="Close"></button>    

    </div>
    <div v-else>
        <button class="gallery__exit-button noimage" @click="exit"><img :src="exitIcon" alt="Close"></button>    
    </div>

</template>

<script setup>
import exitIcon from '../assets/icons/exit.svg';

import { isMobile } from '../utils/devices'; 

let current_image = ref('');


const props = defineProps({
    displayed_images: {
        type: Array,
        default: () => [],
    }
});

const emit = defineEmits(['close']);

const displayed_images = ref([]);

watch(() => props.displayed_images, (new_images) => {
  if (new_images) {
      current_image.value = new_images[0];
  }}, {immediate: true});

function exit() {
    emit('close');
};

</script>