import { ref, watch } from 'vue'

export default function useDialog(watchDep) {
  const isDialogOpen = ref(false)

  watch(watchDep, (value) => {
    if (value) {
      isDialogOpen.value = true
    } else {
      isDialogOpen.value = false
    }
  })

  return { isDialogOpen }
}
