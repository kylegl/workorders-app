<script setup lang="ts">
interface Props {
  modelValue?: string | number
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
      flex gap-x-2 px2 max-h-fit
      input-base
      border="~ base" rounded
      in_out
      focus-within="ring-2 ring-bg-d border-fg-subtle"
    >
      <slot name="before" />
      <input
        w-full p-2 rounded input-base
        placeholder:text-subtle
        in_out
        class="focus:outline-none focus:caret-fg-subtle dark:focus:caret-fg-subtle-d"
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
