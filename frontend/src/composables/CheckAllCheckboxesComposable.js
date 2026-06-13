import { computed } from "vue";

// writable computed to select/deselect all items
export const useCheckAllCheckboxes = (sourceItems, selectedItems) => {
    const checkAllCheckboxes = computed({
        // Returns true only when all items are selected.
        get: () => {
            // if no source items or selected items return false, 
            // that'll prevent from main checkbox to be rendered
            // checked when data isn't loaded yet
            if (!sourceItems?.value?.length || !selectedItems?.value) return false
            return sourceItems.value.length === selectedItems.value.length
        },
        // Setter function to assign/remove all items ids.
        set: (value) => {
            selectedItems.value = value
                ? sourceItems.value.map(item => item.id)
                : []
        }
    })
    return { checkAllCheckboxes }
}
