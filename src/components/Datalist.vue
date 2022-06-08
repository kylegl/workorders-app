<script setup lang="ts">
interface Props {
  type: string
  list: unknown
  modelValue?: string | number
  searchKeys: string[]
  showKeys: string[]
  initialId?: string
}
const { list, searchKeys, type, showKeys, initialId } = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:textValue', value: string | number | undefined): void
  (e: 'update:id', value: string | undefined): void
}>()

const { data } = storeToRefs(useMainStore())
const { getById } = useMainStore()

let textValue = $ref<string | undefined>('')
let id = $ref<string | undefined>('')

onBeforeMount(() => {
  if (initialId) {
    const entry: {} | undefined = getById({ id: initialId, type: 'employees' })
    textValue = entry?.[showKeys[0]]
    id = initialId
  }
})

watchEffect(() => emit('update:textValue', textValue))
watchEffect(() => emit('update:id', id))

const searchResults = computed(() => {
  if (!textValue) return list
  const searchWords = textValue.split(/\+s/)
  const searchData = list

  const results = searchData.filter((row) => {
    return searchWords.every((word) => {
      return searchKeys.some((key) => {
        return row[key].includes(word)
      })
    })
  })

  return results
})

let focus = $ref(false)

const handleFocus = () => focus = true
const handleBlur = () => focus = false
const handleClick = (data) => {
  id = data?.id
  textValue = data?.[showKeys[0]]
}
</script>

<template>
  <div class="">
    <Input
      v-model="textValue"
      :place-holder-text="type"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <ul>
      <template v-if="focus">
        <li v-for="item in searchResults" :key="item?.id">
          <div
            class="flex gap-x-2 bg-bg-c border border-bg-b rounded p-2"
            hover="bg-bg-d"
            in_out
            @mousedown="handleClick(item)"
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
