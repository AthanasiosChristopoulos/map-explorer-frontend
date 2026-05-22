<template>
    <label class="radioButton-label" :for="id">
        <input 
            :id="id"
            type="checkbox"
            :checked="isChecked"
            @change="updateValue"
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

const props = defineProps({
    id: {
        type: [Number, String],
        default: 0
    },
    isChecked: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:isChecked'])

const updateValue = (event) => {
    emit('update:isChecked', event.target.checked);
};

</script>