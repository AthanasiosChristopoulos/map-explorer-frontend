<template>
    <label class="checkbox-label" :for="id">
        <input 
            :id="id"
            type="checkbox"
            name="checkbox"
            :checked="isChecked"
            @change="updateValue"
            :disabled="isDisabled"
            class="styled-checkbox"
            :class="enviromentCheckbox ? 'styled-checkbox-enviroment' : ''"
        >
        <span 
            class="label-text"
            :class="{ 'label-text--checked': isChecked }"
        >
        <slot name="checkbox-label"/>
        </span>
    </label>
</template>

<script>
import { defineComponent, toRefs } from 'vue';

export default defineComponent({
    name: 'Checkbox',
    props: {
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
        }, 
        enviromentCheckbox: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const { id, label, isChecked, isDisabled } = toRefs(props);

        const updateValue = (event) => {
            emit('update:isChecked', event.target.checked);
        };

        return {
            id,
            label,
            isChecked,
            isDisabled,
            updateValue
        };
    }
});
</script>