<script setup lang="ts">
interface Props {
  options: any
  modelValue?: string
  label?: string
  disabled?: boolean
}
const { options, modelValue, label, disabled = false } = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'enter'])

const updateSelected = value => emit('update:modelValue', value)

const go = () => {
  emit('enter')
}
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
    @change="updateSelected($event.target.value)"
    @keydown.enter="enter"
    :disabled="disabled"
  >
    <option v-for="option in options" :key="option" :value="option">
      {{ option }}
    </option>
  </select>
</template>
