<script setup lang="ts">
import type { ContactType, EmployeeType } from '~/types'

const { isAssigned, persons } = defineProps<{
  isAssigned: boolean
  persons?: Array<EmployeeType> | Array<ContactType>
}>()
</script>

<template>
  <div>
    <template v-if="isAssigned">
      <div
        v-for="person in persons" :key="person.id"
        flex gap2 w-full items-center
      >
        <Icon i-lucide:hard-hat text-xl />
        <span v-if="person?.name">{{ person?.name }}</span>
      </div>
    </template>
    <template v-if="!isAssigned">
      <div flex gap2 w-full items-center>
        <Icon i-lucide:hard-hat text-xl text-red/>
      </div>
    </template>
  </div>
</template>
