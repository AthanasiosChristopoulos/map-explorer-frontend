<template>
    <!-- <div id="map" class="map-container"></div> -->
  <div class="map-container">
    <div id="map"></div>
    <MapPopup
        :tour="selectedTour"
        v-model:isVisible="localShowMapPopup"
        :leftButtonText="'Left Button'"
        :rightButtonText="'Right Button'"
        @left-action="toggleMapPopup"
        @right-action="toggleMapPopup" 
        :buttonsWidth="100"
        :subtitle="subtitles"
    >
      <template #mappopup__body v-if="mappopup_body">
        <p>{{ mappopup_body }}</p>
      </template>
    </MapPopup>
  </div>
</template>



<script setup>
import { createApp, h, ref, onMounted, toRef  } from 'vue'
import MapPopup from '@/components/MapPopup.vue'; 
import { useMapInitializer } from '@/composables/useMapInitializer.js'
import { useTooltip } from '@/composables/useTooltip.js'

const selectedTour = ref(null);
// const localShowMapPopup = ref(false);

let setCurrentTour;
let map;
const geoData = ref({});

const props = defineProps({
  showMapPopup: Boolean
});

const emit = defineEmits(['update:showMapPopup']);
const localShowMapPopup = ref(props.showMapPopup);
watch(() => props.showMapPopup, (val) => {
  localShowMapPopup.value = val;
});


onMounted(() => {
  const result = useMapInitializer();
  map = result.map
  geoData.value = result.geoData.value
  
  const tooltip = useTooltip(tours, map, findTours);
  setCurrentTour = tooltip.setCurrentTour;

});

const tours = computed(() =>
  geoData.value?.features?.map(f => ({
    ...f.properties,
  })) || []
);

const subtitles = ref('Clio Muse Tours');
const mappopup_body = ref(`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. `);

// const mappopup_body = ref('');
function closeMapPopup() {
  localShowMapPopup.value = false;
  emit('update:showMapPopup', localShowMapPopup.value);
};

function toggleMapPopup() {
  // showMapPopup.value = !showMapPopup.value ;
  localShowMapPopup.value = !localShowMapPopup.value;
  emit('update:showMapPopup', localShowMapPopup.value);
};

function findTours(id) {
    selectedTour.value = tours.value.find(t => String(t.id) === String(id));
    toggleMapPopup();
};

</script>

