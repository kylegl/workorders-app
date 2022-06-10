<script setup lang="ts">
interface Props {
  modelValue?: string
  placeHolderText?: string
  disabled?: boolean
  label?: string
  type?: string
}
const { modelValue, placeHolderText, disabled = false, label, type = 'text' } = defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'enter', 'focus', 'blur'])

const updateValue = value => emit('update:modelValue', value)
const handleFocus = () => {
  emit('focus')
}
const handleBlur = () => emit('blur')

const enter = () => {
  emit('enter')
}
</script>

<template>
  <div>
    <template v-if="label">
      <label class="text-h5">
        {{ label }}
      </label>
    </template>
    <label />
    <div
      class="flex rounded bg-bg-b border border-fg-subtle gap-x-2 px-[.5rem] in_out max-h-fit"
      focus-within="ring-2 ring-bg-d border-fg-subtle"
    >
      <slot name="before" />
      <input
        class="w-full p-2 rounded bg-bg-b placeholder:text-fg-subtle in_out focus:outline-none focus:caret-fg-norm"
        :placeholder="placeHolderText"
        :type="type"
        :value="modelValue"
        :disabled="disabled"
        @input="updateValue($event.target.value)"
        @keydown.enter="enter"
        @focus="handleFocus"
        @blur="handleBlur"
      >
      <slot name="after" />
    </div>
    <slot name="error" />
  </div>
</template>
