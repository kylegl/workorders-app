<script setup lang="ts">
import type { ContactType, EmployeeType } from '~/types'

const { isAssigned, person } = defineProps<{
  isAssigned: boolean
  person?: EmployeeType | ContactType
}>()
</script>

<template>
  <div flex gap2 w-full items-center>
    <Icon i-lucide:hard-hat text-xl :class="{ 'text-red': !isAssigned }" />
    <span v-if="person?.name">{{ person?.name }}</span>
  </div>
</template>
