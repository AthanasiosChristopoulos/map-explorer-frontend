<template>
    <div class="row-layout" style="padding: 1rem;">
        <img :src="smallLogoRedHorizontal">
        <Text
            v-model="text"
            :placeholder="'Search by location, title'"
            :icon="iconMagnifier"
            :iconPosition="'right'"
            style="width:20%;"
        /> 

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { smallLogoRedHorizontal, Text } from 'vue-library';
import iconMagnifier from 'vue-library/src/assets/icons/magnifier.svg';

const text = ref('');


</script>