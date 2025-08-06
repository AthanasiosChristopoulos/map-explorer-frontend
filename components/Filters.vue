<!-- <template>
    <div class="row-layout" style="padding: 1rem; width: 57vw; justify-content: space-between;">
        <img :src="smallLogoRedHorizontal" style="padding-right: 20% ">
        <div class="row-layout" style="justify-content: center; ">
            <Text
                v-model="text"
                :placeholder="'Search by location, title'"
                :icon="iconMagnifier"
                :iconPosition="'left'"
                style="width: fit-content; padding-right: 1.5rem; flex-shrink: 0;"
            /> 
            <Button 
                :text="`Filters`"
                :buttonClass="`button__white`" 
                :icon="filterIcon"
                @click="openPopup"
            />
        </div>

    </div>
</template> -->

<template>
  <div class="header-bar">
    <img class="header-bar__logo" :src="smallLogoRedHorizontal" />

    <div class="header-bar__center-group">
      <div class="header-bar__search-wrapper">
        <Text
          v-model="text"
          :placeholder="'Search by location, title'"
          :icon="iconMagnifier"
          :iconPosition="'left'"
          class="header-bar__search"
        />
        <Button
          :text="`Filters`"
          :buttonClass="`button__white`"
          :icon="filterIcon"
          @click="openPopup"
          class="header-bar__filters"
        />
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, computed } from 'vue';
import { smallLogoRedHorizontal, Text, Button } from 'vue-library';
import iconMagnifier from '@/assets/icons/magnifier.svg';
import filterIcon from '@/assets/icons/filterIcon.svg';

const text = ref('');


</script>