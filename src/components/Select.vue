<script setup lang="ts">
interface Props {
  options: {
    value: string | number
    display: string | number
  }[]
  modelValue?: string | number | undefined
  label?: string
  disabled?: boolean
  selected?: string | number
}
const { options, modelValue, label, disabled = false, selected } = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const updateSelected = (value: string | undefined) => emit('update:modelValue', value)
</script>

<template>
  <div class="">
    <template v-if="label">
      <label class="text-h5">
        {{ label }}
      </label>
    </template>
  </div>
  <select
    :value="modelValue"
    class="flex rounded bg-bg-b border border-fg-subtle gap-x-2 px-[.5rem] in_out max-h-fit"
    :disabled="disabled"
    @change="updateSelected($event.target?.value)"
  >
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :selected="selected === option.value"
    >
      {{ option.display }}
    </option>
  </select>
</template>
