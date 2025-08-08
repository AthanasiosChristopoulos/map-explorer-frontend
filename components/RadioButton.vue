<template>
    <label class="radioButton-label" :for="id">
        <input 
            :id="id"
            type="checkbox"
            name="checkbox"
            :checked="isChecked"
            @change="updateValue"
            :disabled="isDisabled"
            class="styled-radioButton"
        >
        <span 
            class="label-text"
            :class="{ 'label-text--checked': isChecked }"
        >
        <slot name="radioButton-label"/>
        </span>
    </label>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    id: {
        type: [Number, String],
        default: 0
    },
    isChecked: {
        type: Boolean,
        default: false
    },
    isDisabled: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits('update:isChecked')

const updateValue = (event) => {
    emit('update:isChecked', event.target.checked);
};

</script>