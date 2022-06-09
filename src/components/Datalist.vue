<script setup lang="ts">
import { stringify } from 'querystring'

// props
interface Props {
  type: string
  list: unknown
  modelValue?: string | number
  searchKeys: string[]
  showKeys: string[]
  initialId?: string
}
const { list, searchKeys, type, showKeys, initialId } = defineProps<Props>()
// emits
const emit = defineEmits<{
  (e: 'update:textValue', value: string | number | undefined): void
  (e: 'update:id', value: string | undefined): void
}>()

const [primaryKey] = showKeys

// store
const { data } = storeToRefs(useMainStore())
const { getById } = useMainStore()

// refs
let initialValue = $ref<string | number | undefined>('')
let textValue = $ref<string | number | undefined>('')
let id = $ref<string | undefined>('')
let focus = $ref(false)
let activeIndex = $ref<number | undefined>(undefined)
let validationError = $ref(false)

// hooks
onBeforeMount(() => {
  if (initialId) {
    const entry: {} | undefined = getById({ id: initialId, type: 'employees' })
    initialValue = entry?.[primaryKey]
    textValue = entry?.[primaryKey]
    id = initialId

    // emit initial text value without triggering focus
    emit('update:textValue', textValue)
  }
})

onMounted(() => {
  watch($$(textValue), (textValue, oldValue) => {
    emit('update:textValue', textValue)

    if (textValue !== initialValue)
      focus = true
  })
})
// computed
const isDirty = $computed(() => textValue !== initialValue)
const searchResults = $computed(() => {
  if (!isDirty)
    return list

  const searchWords = textValue?.split(/\+s/)
  const searchData = list

  const results = searchData.filter((row) => {
    return searchWords.every((word) => {
      return searchKeys.some((key) => {
        return row[key].includes(word)
      })
    })
  })

  return results ?? []
})

const errorMessage = computed(() => 'That doesn\'t exist yet.')

// watchers
watchEffect(() => emit('update:id', id))

// event handlers
const handleFocus = () => {
  focus = true
  initialValue = textValue
}
const handleBlur = () => {
  focus = false
  checkEntry()
}

const handleClick = (entry) => {
  setEntry(entry)
}

const handleArrowKey = (direction: string) => {
  // initialize active index
  if (direction === 'down') {
    const max = searchResults?.length

    if (activeIndex < max) activeIdx().increment()
  }

  if (direction === 'up' && (activeIndex > 0)) activeIdx().decrement()
}

const handleHover = (index: number | undefined) => activeIndex = index
const handleEnter = () => {
  console.log('enter', ' active idx', activeIndex)

  if (activeIndex) {
    const activeResult = searchResults[activeIndex]

    setEntry(activeResult)
  }

  if (!activeIndex) checkEntry()
}

const activeIdx = () => {
  activeIndex = activeIndex ?? 0

  const increment = () => activeIndex++
  const decrement = () => activeIndex--
  const clear = () => activeIndex = undefined

  return {
    increment,
    decrement,
    clear,
  }
}

const setFocus = (state: boolean) => {
  focus = state

  if (!state) activeIdx().clear()
}

const setEntry = (entry: {}): void => {
  focus = false
  id = entry?.id
  textValue = entry?.[primaryKey]

  activeIdx().clear()
}

const checkEntry = () => {
  const isEmpty = !textValue

  if (isEmpty && initialValue) {
    focus = false
    textValue = initialValue
  }

  if (textValue) {
    const match: {} | undefined = list.find(row => row[primaryKey] === textValue)

    if (!match) {
      validationError = true

      textValue = initialValue ?? ''
      focus = false
    }

    if (match) setEntry(match)
  }
}
</script>

<template>
  <div class="flex flex-col gap-y-1">
    <span>{{ `initial: ${initialValue}` }}</span>
    <span>{{ `text: ${textValue}` }}</span>
    <span>{{ `dirty?: ${isDirty}` }}</span>
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
