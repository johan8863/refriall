// composables/usePaginationSearch.js
import { ref, computed } from 'vue'
import { useErrorHandler } from './useErrorHandler.js'

export const usePaginationSearch = ({
  fetchFunction,
  searchFunction,
  itemName = 'Items',
  gender = 'm',
  // important: this attribute MUST match de page_size attribute from BaseCustomPagination
  // at ../../../backend/utils/base_paginator.py
  pageSize = 10
}) => {
  const items = ref([])
  const currentPage = ref(1)
  const totalPages = ref(0)
  const totalItems = ref(0)
  const isLoading = ref(false)
  const hasSearched = ref(false)
  const searchTerm = ref('')

  // reutilize useErrorHandler
  const { errorMessage, backendErrors, hasErrors, handleError, clearErrors } = useErrorHandler({
    objectName: itemName,
    gender: gender
  })

  const showPrevButton = computed(() => currentPage.value > 1)
  const showNextButton = computed(() => currentPage.value < totalPages.value)

  const loadItems = async (page = 1, search = '') => {
    isLoading.value = true
    clearErrors() // clear errors before every load

    try {
      const response = search ? await searchFunction(search, page) : await fetchFunction(page)

      const data = response.data
      items.value = data.results || []
      totalPages.value = Math.ceil((data.count || 0) / pageSize)
      totalItems.value = data.count || 0

      return response
    } catch (error) {
      // handleError from composable
      // importat: error states from useErrorHandler will be
      // included in the return of the composable in order
      // to skip re-throwing the error
      handleError(error)
    } finally {
      isLoading.value = false
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.value.trim()) {
      hasSearched.value = false
      currentPage.value = 1
      await loadItems(1, '')
      return
    }
    hasSearched.value = true
    currentPage.value = 1
    await loadItems(1, searchTerm.value)
  }

  const loadNextItems = async () => {
    if (!showNextButton.value) return
    currentPage.value += 1
    const search = hasSearched.value ? searchTerm.value : ''
    await loadItems(currentPage.value, search)
  }

  const loadPrevItems = async () => {
    if (!showPrevButton.value) return
    currentPage.value -= 1
    const search = hasSearched.value ? searchTerm.value : ''
    await loadItems(currentPage.value, search)
  }

  const clearSearch = async () => {
    searchTerm.value = ''
    hasSearched.value = false
    currentPage.value = 1
    clearErrors() // clear errors when cleaning search
    await loadItems(1, '')
  }

  const goToPage = async (page) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    const search = hasSearched.value ? searchTerm.value : ''
    await loadItems(page, search)
  }

  return {
    // state
    items,
    currentPage,
    totalPages,
    totalItems,
    isLoading,
    hasSearched,
    searchTerm,

    // useErrorHandler states
    errorMessage,
    backendErrors,
    hasErrors,

    // Ccomputed
    showPrevButton,
    showNextButton,

    // methods
    loadItems,
    handleSearch,
    loadNextItems,
    loadPrevItems,
    clearSearch,
    goToPage,

    // useErrorHandler methods, just in case they need to be used directly
    clearErrors,
    handleError
  }
}
