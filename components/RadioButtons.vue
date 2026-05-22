<template>
  <div class="radio-buttons" :class="props.layout === 'row' ? 'row-layout': 'column-layout'">
    <div 
      v-for="(radioButton, index) in radioButtons" 
      :key="index"
    >
      <RadioButton 
        :id="`radio-${index}`"
        :isChecked="getCheckedRadioButton(radioButton.label)"
        @update:isChecked="setCheckedRadioButton(radioButton.label)"
        class="radio-button"
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
import RadioButton from './RadioButton.vue';
import IconLabel from '@/components/IconLabel.vue';

const props = defineProps({
  radioButtons: {
    type: Array,
    required: true
  },
  checkedRadioButton: {
    type: Object,
    required: true
  },
  layout: {
    type: String,
    default: 'row',
    validator: (value) => ['row', 'column'].includes(value)
  }
});

const emit = defineEmits(['update:checkedRadioButton']);

function setCheckedRadioButton(label) {
  const selected = props.radioButtons.find(data => data.label === label)
  emit('update:checkedRadioButton', selected)
}

function getCheckedRadioButton(label) {
  return props.checkedRadioButton.label === label
}

</script>
