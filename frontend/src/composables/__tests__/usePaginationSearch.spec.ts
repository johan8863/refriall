import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePaginationSearch } from '../usePaginationSearch'
import type { PaginatedResponse } from '@/types/shared'

// Item test interface
interface TestItem {
  id: number
  name: string
}

// In-memory database
const ALL_ITEMS: TestItem[] = [
  { id: 1, name: 'Item1' },
  { id: 2, name: 'Item2' },
  { id: 3, name: 'Test' },
  { id: 4, name: 'Item3' }
]

const fetchItems = vi.fn()
const searchItems = vi.fn()

describe('usePaginationSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // ✅ fetch: returns all items
    fetchItems.mockResolvedValue({
      data: {
        results: ALL_ITEMS,
        count: ALL_ITEMS.length,
        next: null,
        previous: null
      } as PaginatedResponse<TestItem>
    })

    // ✅ search: filters items based on searchTerm
    searchItems.mockImplementation(async (search: string, page: number = 1) => {
      const filtered = ALL_ITEMS.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
      return {
        data: {
          results: filtered,
          count: filtered.length,
          next: null,
          previous: null
        } as PaginatedResponse<TestItem>
      }
    })
  })

  it('must load items properly', async () => {
    const { items, loadItems, isLoading } = usePaginationSearch<TestItem>({
      fetchFunction: fetchItems,
      searchFunction: searchItems,
      itemName: 'Item'
    })

    await loadItems(1, '')

    expect(items.value).toHaveLength(4)
    expect(isLoading.value).toBe(false)
  })

  it('handle search returns items based on search term', async () => {
    const { items, searchTerm, handleSearch } = usePaginationSearch<TestItem>({
      fetchFunction: fetchItems,
      searchFunction: searchItems,
      itemName: 'Item'
    })

    searchTerm.value = 'Item'
    await handleSearch()

    expect(items.value).toHaveLength(3)
    expect(items.value.every((item) => item.name.includes('Item'))).toBe(true)
  })

  it('must return empty when no matches', async () => {
    const { items, searchTerm, handleSearch } = usePaginationSearch<TestItem>({
      fetchFunction: fetchItems,
      searchFunction: searchItems,
      itemName: 'Item'
    })

    searchTerm.value = 'OtherName'
    await handleSearch()

    expect(items.value).toHaveLength(0)
  })
})
