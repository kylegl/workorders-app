<script setup lang="ts">
import type { DataTableName, DataTables, TableRowKeys } from '~/api/apiResponseTypes'

// props
interface Props {
  type: DataTableName
  list: DataTables
  modelValue?: string
  searchKeys: TableRowKeys[]
  showKeys: string[]
}
const { list, searchKeys, type, modelValue, showKeys } = defineProps<Props>()
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
// let id = $ref<string | undefined>('')
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

  if (isFocused) initialValue = textValue

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
const handleFocus = () => {
  setFocus({ isFocused: true })
}
const handleBlur = () => {
  checkEntry()
}

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
</script>

<template>
  <div class="flex flex-col gap-y-1">
    <Input
      v-model="textValue"
      :place-holder-text="type"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown.arrow-down="handleArrowKey('down')"
      @keydown.arrow-up="handleArrowKey('up')"
      @keydown.escape="handleBlur"
      @keydown.enter="handleEnter"
    >
      <template v-if="validationError" #error>
        <div class="text-red ">
          {{ errorMessage }}
        </div>
      </template>
    </Input>
    <ul>
      <template v-if="focus">
        <li v-for="(item, index) in searchResults" :key="item?.id">
          <div
            class="flex gap-x-2 bg-bg-c border border-bg-b rounded p-2"
            :class="{ 'bg-bg-d': activeIndex === index }"
            in_out
            @mousedown="handleClick(item)"
            @mouseover="handleHover(index)"
            @mouseleave="handleHover(undefined)"
          >
            <div v-for="key in showKeys" :key="key">
              <div class="flex gap-x-2">
                <span>{{ item[key] }}</span>
              </div>
            </div>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>
