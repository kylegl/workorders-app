<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import Fuse from 'fuse.js'
import type { StoreData, StoreDataKey } from '~/types'
// props
interface Props {
  type: StoreDataKey
  list: StoreData[] | undefined
  modelValue?: string | null
  searchKeys: string[]
  showKeys: string[]
  label?: string
  disabled?: boolean
}
const { list, searchKeys, label, disabled, type, modelValue, showKeys } = defineProps<Props>()
// emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const [primaryKey] = showKeys
let id = $ref(modelValue)

// store
const { getById } = useMainStore()

// refs
let initialValue = $ref<string | undefined>('')
let textValue = $ref<string | undefined>('')
let focus = $ref(false)
let activeIndex = $ref<number>(-1)
let validationError = $ref(false)

// hooks
const getDisplayStr = (entry: StoreData, showKeys: Array<string>) => showKeys.map(key => entry[key]).filter(Boolean).join(' | ')
onBeforeMount(() => {
  if (id) {
    const entry = getById({ id, type })
    initialValue = getDisplayStr(entry, showKeys)
    textValue = initialValue
  }
})

// computed
const isDirty = $computed(() => textValue !== initialValue)
const errorMessage = computed(() => 'That doesn\'t exist yet.')

// helpers
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
    initialValue = textValue
    validationError = false
  }

  if (!isFocused) {
    activeIdx().clear()

    if (reset) textValue = initialValue ?? ''
  }
}

const setEntry = (entry: StoreData): void => {
  try {
    id = entry?.id

    if (id) {
      textValue = getDisplayStr(entry, showKeys)
      initialValue = textValue
      emit('update:modelValue', id)
    }

    if (!id)
      throw new Error('No ID on entry')

    setFocus({ isFocused: false })
  }
  catch (err) {
    getErrorMessage(err)
  }
}

const checkEntry = () => {
  const isNotEmpty = textValue
  const hasChange = initialValue !== textValue

  if (hasChange && isNotEmpty) {
    const match: {} | undefined = list.find((row: {}) => row[primaryKey] === textValue)

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

const handleClick = (entry) => {
  setEntry(entry)
}

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

const options = {
  minMatchCharLength: 1,
  threshold: 0.3,
  keys: searchKeys,
}
const fuse = $computed(() => new Fuse(list, options))
const searchResults = $computed(() => {
  if (!isDirty) return list
  return fuse.search(textValue)
    ?.map((result) => {
      return result.item
    })
})
</script>

// TODO click needs to be on button not the icon. FIx date parse

<template>
  <div v-on-click-outside="handleBlur" flex="~ col" gap1 relative>
    <Input
      v-model="textValue"
      :label="label"
      :disabled="disabled"
      :place-holder-text="type"
      @focus="handleFocus"
      @keydown.arrow-down="handleArrowKey('down')"
      @keydown.arrow-up="handleArrowKey('up')"
      @keydown.escape="handleBlur"
      @keydown.enter="handleEnter"
    >
      <template v-if="!disabled" #after>
        <button px2>
          <Icon i-fa:chevron-down m-auto @click="toggleFocus()" />
        </button>
      </template>
      <template v-if="validationError" #error>
        <div text-red>
          {{ errorMessage }}
        </div>
      </template>
    </Input>
    <template v-if="focus">
      <ul
        absolute top-full min-w-full
        border="~ base"
        list-none
      >
        <li
          v-for="(item, index) in searchResults" :key="item?.id"
          flex border="b base"
          in_out w-full p2
          :class="[activeIndex === index ? 'bg-base' : 'input-base']"
          @mousedown="handleClick(item)" @mouseover="handleHover(index)"
          @mouseleave="handleHover(-1)"
        >
          <div
            v-for="key in showKeys" :key="key"
          >
            <template v-if="item?.[key]">
              <div pr-5>
                {{ item[key] }}
              </div>
            </template>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>
