<script setup lang="ts">
import 'vue-select/dist/vue-select.css'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import { useFuse } from '@vueuse/integrations/useFuse'

const props = defineProps<{
  data: Array<any>
  value: any
  searchKeys: string[]
  label?: string
  multiple?: boolean
  taggable?: boolean
  disabled?: boolean
  pushTags?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:value', value?: any): void
}>()

const value = useVModel(props, 'value', emit)

const fuseOptions = $computed<UseFuseOptions<typeof value>>(() => ({
  fuseOptions: {
    keys: props.searchKeys,
    threshold: 0.3,
    shouldSort: true,
  },
}))
function fuseSearch(options, search) {
  const { results } = useFuse(search, options, fuseOptions)
  return search.length ? results.value.map(item => item.item) : options
}
</script>

<template>
  <div>
    <v-select
      id="select"
      v-model="value"
      :filter="fuseSearch"
      :label="label" :options="data"
      :multiple="multiple"  :taggable="taggable" :push-tags="pushTags" :disabled="disabled"
    />
  </div>
</template>

<style>
:root {
  --vs-dropdown-bg: #FAFAFA;
  --vs-dropdown-option--active-bg: #e4e4e7;
  --vs-dropdown-option--active-color: #18181b;
}
</style>
