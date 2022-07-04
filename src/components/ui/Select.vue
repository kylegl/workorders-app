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

const activeIdx = $computed((): number => {
  if (activeIndex < -1) {
    activeIndex = -1
    return -1
  }

  if (activeIndex >= list.length) {
    activeIndex = list.length - 1
    return list.length - 1
  }

  return activeIndex
})

const setFocus = ({ isFocused, reset }: { isFocused: boolean; reset?: boolean }) => {
  focus = isFocused

  if (isFocused) {
    initialValue = value
    validationError = false
  }

  if (!isFocused) {
    activeIndex = -1

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

const isActive = (index: number): boolean => activeIdx === index
const isLastIdx = (index: number): boolean => searchResults.length - 1 === index

// event handlers
const handleFocus = () => setFocus({ isFocused: true })

const handleBlur = () => checkEntry()

const handleClick = value => setEntry(value)

const handleHover = (index: number) => {
  activeIndex = index
}
const handleEnter = () => {
  if (activeIdx > -1) {
    const activeResult = searchResults[activeIdx]

    setEntry(activeResult)
  }

  if (activeIdx < 0) checkEntry()
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
      @keydown.arrow-down="activeIndex++"
      @keydown.arrow-up="activeIndex--"
      @keydown.escape="handleBlur"
      @keydown.enter="handleEnter"
    >
      <template v-if="!disabled" #after>
        <button>
          <Icon class="i-fa:chevron-down m-auto" @click="toggleFocus()" mx2/>
        </button>
      </template>
      <template v-if="validationError" #error>
        <div text-red>
          {{ errorMessage }}
        </div>
      </template>
    </Input>
    <template v-if="focus">
      <ul absolute top-full min-w-full max-w-max z-10 list-none shadow-md>
        <li v-for="item, index in searchResults" :key="item">
          <div
            flex gap-x-2 p-2 justify-between
            border="~ base"
            :class="[isActive(index) ? 'bg-base' : 'input-base',
            isLastIdx(index) ? 'rounded-b' : '']"
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
