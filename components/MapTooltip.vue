<template>
  <div class="column-layout maptooltip">
    <Tag
      :label="`${tour.stories} Stories`"
      :color="`purple`"
      style="padding: 0.5rem 0.7rem;"
    ></Tag>
    

    <h4>{{ tour.title }}</h4>

    <img 
        :src="tour.images.cover" 
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
          style="padding-left: 1.2rem; padding-right: 1.2rem; background: #43ABFF;"
      /> 
    </div>
  </div>
</template>

<script setup>
import { Button } from 'vue-library';
import Tag from '@/components/Tag.vue';

const props = defineProps({
    tour: {
      type: Object,
      required: true
    }
});

const emit = defineEmits(['openMappopup']);

function openMappopup() {
  emit('openMappopup');
}
</script>