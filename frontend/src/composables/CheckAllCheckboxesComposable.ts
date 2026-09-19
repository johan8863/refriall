// composables/CheckAllCheckboxesComposable.ts
import { computed, type Ref, type ComputedRef } from 'vue'

interface HasId {
  id: number
}

interface CheckAllCheckboxesReturn {
  checkAllCheckboxes: ComputedRef<boolean>
}

/**
 * Writable computed to select/deselect all items
 * @param sourceItems - Source list of items
 * @param selectedItems - Selected items IDs (writable ref)
 */
export const useCheckAllCheckboxes = <T extends HasId>(
  sourceItems: Ref<T[]>,
  selectedItems: Ref<number[]>
): CheckAllCheckboxesReturn => {
  const checkAllCheckboxes = computed({
    // Returns true only when all items are selected
    get: () => {
      if (!sourceItems?.value?.length || !selectedItems?.value) return false
      return sourceItems.value.length === selectedItems.value.length
    },
    // Setter function to assign/remove all items ids
    set: (value: boolean) => {
      selectedItems.value = value ? sourceItems.value.map((item) => item.id) : []
    }
  })

  return { checkAllCheckboxes }
}
