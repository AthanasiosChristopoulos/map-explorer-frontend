<template>
  <div class="column-layout maptooltip">
    <Tag
      :label="`${tour.stories} Stories`"
      :color="`purple`"
    ></Tag>

    <h4>{{ tour.title }}</h4>

    <img 
        :src="current_image" 
        alt="Preview not available" 
        class="maptooltip__img" 
    />

    <div class="button__footer" style="margin-top:0.3rem">
      <Button
          :type="'submit'"
          :text="`Details`"
          :buttonClass="'button__light-blue'"
          :iconPosition="'right'"
          @click="openMappopup"
          style="padding-left: 1.2rem; padding-right: 1.2rem;"
      /> 
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Button } from 'vue-library';
import Tag from '@/components/Tag.vue';

let current_image = ref('');
let number_of_stories = ref(0);

const props = defineProps({
    tour: {
      type: Object,
      required: true
    }
});

const emit = defineEmits(['openMappopup']);

watch(() => props.tour, (new_tour) => {
  if (new_tour) {
      current_image.value = new_tour.images.cover;
  }}, {immediate: true});

function openMappopup() {
  emit('openMappopup');
}
</script>