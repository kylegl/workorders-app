export function useConvertSyncRefs(initial, watch, transformA, transformB) {
  watch.value = transformA(initial.value)

  const { ignoreUpdates } = watchIgnorable(watch, () => {
    initial.value = transformB(watch.value)
  })

  ignoreUpdates(() => !watch.value)
}
