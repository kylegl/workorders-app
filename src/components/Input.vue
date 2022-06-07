<script setup lang="ts">
interface Props {
  modelValue: string
  placeHolderText?: string
  disabled?: boolean
  label?: string
  type?: string1
}
const { modelValue, placeHolderText, disabled = false, label, type = 'text' } = defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'enter'])

const updateValue = value => emit('update:modelValue', value)

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
      >
      <slot name="after" />
    </div>
  </div>
</template>
