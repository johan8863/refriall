import { ref, computed } from 'vue'
import { useErrorHandler } from './useErrorHandler.js'

/**
 * Composable for handling paginated lists with search functionality
 *
 * @param {Object} config - Configuration object
 * @param {Function} config.fetchFunction - Function to fetch paginated data
 * @param {Function} config.searchFunction - Function to search paginated data
 * @param {string} config.itemName - Name of the item (used in error messages)
 * @param {string} config.gender - Gender of the item ('m' for masculine, 'f' for feminine)
 * @param {number} config.pageSize - Number of items per page. MUST match the page_size attribute
 *                                   from BaseCustomPagination at backend/utils/base_paginator.py
 * @returns {Object} Pagination state and methods
 */
export const usePaginationSearch = ({
  fetchFunction,
  searchFunction,
  itemName = 'Items',
  gender = 'm',
  // IMPORTANT: This attribute MUST match the page_size attribute
  // from BaseCustomPagination at ../../../backend/utils/base_paginator.py
  pageSize = 10
}) => {
  // State
  const items = ref([])
  const currentPage = ref(1)
  const totalPages = ref(0)
  const totalItems = ref(0)
  const isLoading = ref(false)
  const hasSearched = ref(false)
  const searchTerm = ref('')

  // Reuse useErrorHandler for consistent error handling across the application
  const { errorMessage, backendErrors, hasErrors, handleError, clearErrors } = useErrorHandler({
    objectName: itemName,
    gender: gender
  })

  // Computed properties for pagination controls
  const showPrevButton = computed(() => currentPage.value > 1)
  const showNextButton = computed(() => currentPage.value < totalPages.value)

  /**
   * Load items with pagination and optional search
   * @param {number} page - Page number to load
   * @param {string} search - Search term (optional)
   * @returns {Promise<Object>} Response data
   */
  const loadItems = async (page = 1, search = '') => {
    isLoading.value = true
    clearErrors() // Clear previous errors before each load

    try {
      const response = search ? await searchFunction(search, page) : await fetchFunction(page)

      const data = response.data
      items.value = data.results || []
      totalPages.value = Math.ceil((data.count || 0) / pageSize)
      totalItems.value = data.count || 0

      return response
    } catch (error) {
      // Handle error using the composable's error handler
      // Important: Error states from useErrorHandler are included in the return
      // object, so we don't need to re-throw the error
      handleError(error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Handle search action
   * Clears search or executes search based on search term
   */
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

  /**
   * Load the next page of items
   */
  const loadNextItems = async () => {
    if (!showNextButton.value) return
    currentPage.value += 1
    const search = hasSearched.value ? searchTerm.value : ''
    await loadItems(currentPage.value, search)
  }

  /**
   * Load the previous page of items
   */
  const loadPrevItems = async () => {
    if (!showPrevButton.value) return
    currentPage.value -= 1
    const search = hasSearched.value ? searchTerm.value : ''
    await loadItems(currentPage.value, search)
  }

  /**
   * Clear the current search and reset to the first page
   */
  const clearSearch = async () => {
    searchTerm.value = ''
    hasSearched.value = false
    currentPage.value = 1
    clearErrors() // Clear errors when clearing search
    await loadItems(1, '')
  }

  /**
   * Navigate to a specific page
   * @param {number} page - Page number to navigate to
   */
  const goToPage = async (page) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    const search = hasSearched.value ? searchTerm.value : ''
    await loadItems(page, search)
  }

  return {
    // State
    items,
    currentPage,
    totalPages,
    totalItems,
    isLoading,
    hasSearched,
    searchTerm,

    // useErrorHandler state
    errorMessage,
    backendErrors,
    hasErrors,

    // Computed
    showPrevButton,
    showNextButton,

    // Methods
    loadItems,
    handleSearch,
    loadNextItems,
    loadPrevItems,
    clearSearch,
    goToPage,

    // useErrorHandler methods (exposed in case direct usage is needed)
    clearErrors,
    handleError
  }
}
