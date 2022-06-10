<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'

// props
interface Props {
  list: any[]
  modelValue?: string | number | undefined
  label?: string
  disabled?: boolean
}
const { list, label, disabled, modelValue } = defineProps<Props>()
// emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | undefined | number): void
}>()

// refs
let initialValue = $ref<string | undefined | number>('')
let value = $ref<string | undefined | number>('')
let focus = $ref(false)
let activeIndex = $ref<number>(-1)
let validationError = $ref(false)

onBeforeMount(() => value = modelValue)
// computed
const isDirty = $computed(() => value !== initialValue)
const errorMessage = computed(() => 'That doesn\'t exist yet.')
const searchResults = $computed(() => {
  if (!isDirty)
    return list

  const searchWords = value?.split(/\+s/)
  const searchData = list

  const results = searchData.filter((row) => {
    return searchWords?.every((word) => {
      return row.includes(word)
    })
  })

  return results ?? []
})

const activeIdx = () => {
  activeIndex = activeIndex ?? 0

  const increment = () => activeIndex++
  const decrement = () => activeIndex--
  const clear = () => activeIndex = -1

  return {
    increment,
    decrement,
    clear,
  }
}

const setFocus = ({ isFocused, reset }: { isFocused: boolean; reset?: boolean }) => {
  focus = isFocused

  if (isFocused) {
    initialValue = value
    validationError = false
  }

  if (!isFocused) {
    activeIdx().clear()

    if (reset) value = initialValue ?? ''
  }
}

const setEntry = (newValue: string | number | undefined): void => {
  try {
    value = newValue
    initialValue = value
    emit('update:modelValue', value)
    setFocus({ isFocused: false })
  }
  catch (err) {
    getErrorMessage(err)
  }
}

const checkEntry = () => {
  const isNotEmpty = value
  const hasChange = initialValue !== value

  if (hasChange && isNotEmpty) {
    const match: string | number | undefined = list.find((el: string | number | undefined) => el === value)

    if (match)
      setEntry(match)

    if (!match) {
      validationError = true

      setFocus({ isFocused: false, reset: true })
    }
  }

  if (!hasChange) setFocus({ isFocused: false })

  if (!isNotEmpty && initialValue)
    setFocus({ isFocused: false, reset: true })
}

// event handlers
const handleFocus = () => setFocus({ isFocused: true })

const handleBlur = () => checkEntry()

const handleClick = value => setEntry(value)

const handleArrowKey = (direction: string) => {
  if (direction === 'down') {
    const max = searchResults?.length

    if (activeIndex < max) activeIdx().increment()
  }

  if (direction === 'up' && (activeIndex > -1)) activeIdx().decrement()
}

const handleHover = (index: number) => activeIndex = index
const handleEnter = () => {
  if (activeIndex > -1) {
    const activeResult = searchResults[activeIndex]

    setEntry(activeResult)
  }

  if (activeIndex < 0) checkEntry()
}
const toggleFocus = () => focus ? handleBlur() : handleFocus()
</script>

<template>
  <div v-on-click-outside="handleBlur" class="flex flex-col gap-y-1 relative">
    <Input
      v-model="value"
      :label="label"
      :disabled="disabled"
      @focus="handleFocus"
      @keydown.arrow-down="handleArrowKey('down')"
      @keydown.arrow-up="handleArrowKey('up')"
      @keydown.escape="handleBlur"
      @keydown.enter="handleEnter"
    >
      <template v-if="!disabled" #after>
        <button>
          <Icon class="i-fa:chevron-down m-auto" @click="toggleFocus()" />
        </button>
      </template>
      <template v-if="validationError" #error>
        <div class="text-red ">
          {{ errorMessage }}
        </div>
      </template>
    </Input>
    <template v-if="focus">
      <ul class="absolute top-full min-w-full max-w-max z-10">
        <li v-for="(item, index) in searchResults" :key="item">
          <div
            class="flex gap-x-2 bg-bg-c border border-bg-b rounded p-2 justify-between"
            :class="{ 'bg-bg-d': activeIndex === index }"
            in_out
            @mousedown="handleClick(item)"
            @mouseover="handleHover(index)"
            @mouseleave="handleHover(-1)"
          >
            {{ item }}
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>
