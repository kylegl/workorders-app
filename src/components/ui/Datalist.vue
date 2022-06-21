<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'

// props
interface Props {
  type: DataTableName
  list: DataTables
  modelValue?: string
  searchKeys: TableRowKeys[]
  showKeys: string[]
  label?: string
  disabled?: boolean
}
const { list, searchKeys, label, disabled, type, modelValue, showKeys } = defineProps<Props>()
// emits
const emit = defineEmits<{
  (e: 'update:textValue', value: string | number | undefined): void
  (e: 'update:id', value: string | undefined): void
  (e: 'update:modelValue', value: string): void
}>()

const [primaryKey] = showKeys
let id = $ref(modelValue)

// store
const { data } = storeToRefs(useMainStore())
const { getById } = useMainStore()

// refs
let initialValue = $ref<string | undefined>('')
let textValue = $ref<string | undefined>('')
let focus = $ref(false)
let activeIndex = $ref<number>(-1)
let validationError = $ref(false)

// hooks
onBeforeMount(() => {
  if (id) {
    const entry = getById({ id, type })
    initialValue = entry?.[primaryKey]
    textValue = entry?.[primaryKey]
  }
})

// computed
const isDirty = $computed(() => textValue !== initialValue)
const errorMessage = computed(() => 'That doesn\'t exist yet.')
const searchResults = $computed(() => {
  if (!isDirty)
    return list

  const searchWords = textValue?.split(/\+s/)
  const searchData = list

  const results = searchData.filter((row) => {
    return searchWords?.every((word) => {
      return searchKeys.some((key) => {
        return row[key].includes(word)
      })
    })
  })

  return results ?? []
})

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

const setEntry = (entry: {}): void => {
  try {
    id = entry?.id

    if (id) {
      textValue = entry?.[primaryKey]
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

const handleClick = entry => setEntry(entry)

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
        <button>
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
          flex bg-2 border="b base"
          in_out
        >
          <div
            v-for="key in showKeys" :key="key"
            :class="{ 'bg-bg-d': activeIndex === index }"
            @mousedown="handleClick(item)"
            @mouseover="handleHover(index)"
            @mouseleave="handleHover(-1)"
            p2 w-full
          >
            <template v-if="item[key]">
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
