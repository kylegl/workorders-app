<script setup>
const props = defineProps({
  modelValue: String,
  placeHolderText: String,
})
const emit = defineEmits(['update:modelValue', 'enter'])

const updateValue = value => emit('update:modelValue', value)

const enter = () => {
  emit('enter')
}
</script>

<template>
  <div
    class="flex rounded bg-bg-b border border-fg-subtle gap-x-2 px-[.5rem] in_out max-h-fit"
    focus-within="ring-2 ring-bg-d border-fg-subtle"
  >
    <slot name="before" />
    <input
      class="w-full p-2 rounded bg-bg-b placeholder:text-fg-subtle in_out focus:outline-none focus:caret-fg-norm"
      :placeholder="placeHolderText"
      :value="props.modelValue"
      @input="updateValue($event.target.value)"
      @keydown.enter="enter"
    >
    <slot name="after" />
  </div>
</template>
