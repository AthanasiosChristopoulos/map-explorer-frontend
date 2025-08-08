<!-- RadioButtons.vue -->
<template>
  <div class="radio-buttons" :class="props.layout === 'row' ? 'row-layout': 'column-layout'" style="gap: 4rem;">
    <div 
      v-for="(radioButton, index) in radioButtons" 
      :key="index"
    >
      <RadioButton 
        :id="`radio-${index}`"
        :name="groupName"
        :value="radioButton.value"
        :isChecked="getCheckedRadioButton(radioButton.label)"
        @update:isChecked="setCheckedRadioButton(radioButton.label)"
        class="filter-body__indoors-checkbox"
      >
        <template #radioButton-label>
          <IconLabel 
            :icon="radioButton.icon"
            :label="radioButton.label"
            :showLabel="radioButton.showLabel"
            :size="radioButton.size"
          />
        </template>
      </RadioButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import RadioButton from './RadioButton.vue';
import IconLabel from '@/components/IconLabel.vue';

const props = defineProps({
  radioButtons: {
    type: Array,
    required: true
  },
  groupName: {
    type: String,
    default: 'radio-group'
  },
  layout: {
    type: String,
    default: 'row'
  }
});

const emit = defineEmits(['update:modelValue']);

const checkedRadioButton = ref('')

function setCheckedRadioButton(label) {
  checkedRadioButton.value = label
}

function getCheckedRadioButton(label) {
  return checkedRadioButton.value === label
}
</script>
