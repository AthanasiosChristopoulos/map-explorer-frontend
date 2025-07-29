<template>
  <div class="column-layout maptooltip">
    
    <Tag
      :label="storiesNumberLabel"
      :backgroundColor="'#E6EDFF'"   
      :textColor="'#5E6C93'"        
      :small="true"
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
import {computed} from 'vue';
import { Button, Tag } from 'vue-library';

const props = defineProps({
    tour: {
      type: Object,
      required: true
    }
});

const storiesNumberLabel = computed(() => {return `${props.tour.stories} stories`});
const emit = defineEmits(['openMappopup']);

function openMappopup() {
  emit('openMappopup');
}
</script>