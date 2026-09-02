import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { useErrorHandler } from './useErrorHandler'
import type { AxiosResponse } from 'axios'
import type { PaginatedResponse } from '../types/shared'

/**
 * Configuration options for usePaginationSearch composable
 */
interface UsePaginationSearchOptions<T> {
  /** Function to fetch paginated data */
  fetchFunction: (page?: number, search?: string) => Promise<AxiosResponse<PaginatedResponse<T>>>
  /** Function to search paginated data */
  searchFunction: (search: string, page: number) => Promise<AxiosResponse<PaginatedResponse<T>>>
  /** Name of the item (used in error messages) */
  itemName?: string
  /** Gender of the item ('m' for masculine, 'f' for feminine) */
  gender?: 'm' | 'f'
  /** Number of items per page. Must match backend paginator. */
  pageSize?: number
}

/**
 * Composable for handling paginated lists with search functionality
 *
 * @template T - The type of items in the list
 * @param {UsePaginationSearchOptions<T>} config - Configuration object
 *
 * @example
 * ```typescript
 * const {
 *   items: kits,
 *   isLoading,
 *   loadItems,
 *   handleSearch
 * } = usePaginationSearch<Kit>({
 *   fetchFunction: kitService.listKit,
 *   searchFunction: kitService.searchKits,
 *   itemName: 'Kit',
 *   gender: 'm'
 * })
 * ```
 */
export const usePaginationSearch = <T extends Record<string, any>>({
  fetchFunction,
  searchFunction,
  itemName = 'Items',
  gender = 'm' as 'm' | 'f',
  pageSize = 10
}: UsePaginationSearchOptions<T>) => {
  // ============================================================
  // 1. STATE
  // ============================================================
  const items = ref<T[]>([])
  const currentPage = ref(1)
  const totalPages = ref(0)
  const totalItems = ref(0)
  const isLoading = ref(false)
  const hasSearched = ref(false)
  const searchTerm = ref('')

  // ============================================================
  // 2. ERROR HANDLING
  // ============================================================
  const { errorMessage, backendErrors, hasErrors, handleError, clearErrors } = useErrorHandler({
    objectName: itemName,
    gender: gender
  })

  // ============================================================
  // 3. COMPUTED
  // ============================================================
  const showPrevButton = computed(() => currentPage.value > 1)
  const showNextButton = computed(() => currentPage.value < totalPages.value)

  // ============================================================
  // 4. METHODS
  // ============================================================

  /**
   * Load items with pagination and optional search
   *
   * @param {number} page - Page number to load
   * @param {string} search - Search term (optional, defaults to empty string)
   * @returns {Promise<any>} Response data
   */
  const loadItems = async (page: number = 1, search: string = ''): Promise<any> => {
    isLoading.value = true
    clearErrors()

    try {
      const response = search ? await searchFunction(search, page) : await fetchFunction(page)

      const data = response.data
      items.value = data.results || []
      totalPages.value = Math.ceil((data.count || 0) / pageSize)
      totalItems.value = data.count || 0

      return response
    } catch (error) {
      handleError(error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Handle search action
   * Clears search or executes search based on search term
   */
  const handleSearch = async (): Promise<void> => {
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
  const loadNextItems = async (): Promise<void> => {
    if (!showNextButton.value) return
    currentPage.value += 1
    const search = hasSearched.value ? searchTerm.value : ''
    await loadItems(currentPage.value, search)
  }

  /**
   * Load the previous page of items
   */
  const loadPrevItems = async (): Promise<void> => {
    if (!showPrevButton.value) return
    currentPage.value -= 1
    const search = hasSearched.value ? searchTerm.value : ''
    await loadItems(currentPage.value, search)
  }

  /**
   * Clear the current search and reset to the first page
   */
  const clearSearch = async (): Promise<void> => {
    searchTerm.value = ''
    hasSearched.value = false
    currentPage.value = 1
    clearErrors()
    await loadItems(1, '')
  }

  /**
   * Navigate to a specific page
   *
   * @param {number} page - Page number to navigate to
   */
  const goToPage = async (page: number): Promise<void> => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    const search = hasSearched.value ? searchTerm.value : ''
    await loadItems(page, search)
  }

  // ============================================================
  // 5. RETURN
  // ============================================================
  return {
    // State
    items,
    currentPage,
    totalPages,
    totalItems,
    isLoading,
    hasSearched,
    searchTerm,

    // Error state
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

    // Error methods
    clearErrors,
    handleError
  }
}
