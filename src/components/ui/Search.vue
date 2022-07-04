<script setup lang="ts">
import Fuse from 'fuse.js'
const { data, keys } = defineProps<{
  data: any[]
  keys: string[]
  initial?: string
}>()

const emit = defineEmits(['update:results'])

const options = {
  minMatchCharLength: 1,
  threshold: 0.3,
  keys,
}

const searchValue = $ref('')
const fuse = $computed(() => new Fuse(data, options))
const searchResult = $computed(() => {
  if (searchValue === '') return data
  return fuse.search(searchValue)
    ?.map((result) => {
      return result.item
    })
})
</script>

<template>
  <div>
    <Input
      v-model="searchValue"
      type="text"
      place-holder-text="Search..."
      @keydown.enter="emit('update:results', searchResult)"
      @input="emit('update:results', searchResult)"
    >
      <template #after>
        <button class="flex" @click="true">
          <Icon i-fluent-search-12-regular text-2xl in_out m-auto action-hover mx2/>
        </button>
      </template>
    </Input>
  </div>
</template>
