import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock vue-router before importing useRouting
vi.mock('vue-router', () => ({
  useRouter: vi.fn()
}))

import { useRouter } from 'vue-router'
import { useRouting } from '../routingFunctions'

describe('useRouting', () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useRouter).mockReturnValue({
      push: mockPush
    } as any)
  })

  // ============================================================
  // 1. goToList
  // ============================================================
  describe('goToList', () => {
    it('must navigate to the list route', () => {
      const { goToList } = useRouting()

      goToList('kits')

      expect(mockPush).toHaveBeenCalledWith({ name: 'kits' })
      expect(mockPush).toHaveBeenCalledTimes(1)
    })

    it('must throw when route name is empty', () => {
      const { goToList } = useRouting()

      expect(() => goToList('')).toThrow('[goToList] Route name must be a non empty valid string')
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('must throw when route name is not a string', () => {
      const { goToList } = useRouting()

      expect(() => goToList(null as any)).toThrow(
        '[goToList] Route name must be a non empty valid string'
      )
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('must not navigate when validation fails', () => {
      const { goToList } = useRouting()

      try {
        goToList('')
      } catch {
        // Error expected
      }

      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  // ============================================================
  // 2. goToDetail
  // ============================================================
  describe('goToDetail', () => {
    it('must navigate to the detail route with numeric id', () => {
      const { goToDetail } = useRouting()

      goToDetail('kits_detail', 1)

      expect(mockPush).toHaveBeenCalledWith({
        name: 'kits_detail',
        params: { id: 1 }
      })
    })

    it('must navigate to the detail route with string id', () => {
      const { goToDetail } = useRouting()

      goToDetail('kits_detail', 'abc')

      expect(mockPush).toHaveBeenCalledWith({
        name: 'kits_detail',
        params: { id: 'abc' }
      })
    })

    it('must throw when route name is empty', () => {
      const { goToDetail } = useRouting()

      expect(() => goToDetail('', 1)).toThrow(
        '[goToDetail] Route name must be a non empty valid string'
      )
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('must throw when objectID is null', () => {
      const { goToDetail } = useRouting()

      expect(() => goToDetail('kits_detail', null as any)).toThrow(
        '[goToDetail] Object ID must be a non empty value'
      )
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('must throw when objectID is undefined', () => {
      const { goToDetail } = useRouting()

      expect(() => goToDetail('kits_detail', undefined as any)).toThrow(
        '[goToDetail] Object ID must be a non empty value'
      )
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('must validate route name before objectID', () => {
      const { goToDetail } = useRouting()

      // Empty route name and null objectID, should throw route name error first
      expect(() => goToDetail('', null as any)).toThrow(
        '[goToDetail] Route name must be a non empty valid string'
      )
    })
  })

  // ============================================================
  // 3. goBack
  // ============================================================
  describe('goBack', () => {
    it('must navigate to detail when objectID is provided', () => {
      const { goBack } = useRouting()

      goBack('kits', 'kits_detail', 1)

      expect(mockPush).toHaveBeenCalledWith({
        name: 'kits_detail',
        params: { id: 1 }
      })
    })

    it('must navigate to list when objectID is not provided', () => {
      const { goBack } = useRouting()

      goBack('kits', 'kits_detail')

      expect(mockPush).toHaveBeenCalledWith({ name: 'kits' })
    })

    it('must navigate to list when objectID is null', () => {
      const { goBack } = useRouting()

      goBack('kits', 'kits_detail', null)

      expect(mockPush).toHaveBeenCalledWith({ name: 'kits' })
    })

    it('must navigate to list when objectID is undefined', () => {
      const { goBack } = useRouting()

      goBack('kits', 'kits_detail', undefined)

      expect(mockPush).toHaveBeenCalledWith({ name: 'kits' })
    })

    it('must throw when list route name is empty', () => {
      const { goBack } = useRouting()

      expect(() => goBack('', 'kits_detail', 1)).toThrow(
        '[goBack] Route name must be a non empty valid string'
      )
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('must throw when detail route name is empty', () => {
      const { goBack } = useRouting()

      expect(() => goBack('kits', '', 1)).toThrow(
        '[goBack] Route name must be a non empty valid string'
      )
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('must throw when objectID is not a number', () => {
      const { goBack } = useRouting()

      expect(() => goBack('kits', 'kits_detail', 'abc')).toThrow(
        '[goBack] Object ID must be a valid integer'
      )
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('must allow objectID as undefined without throwing', () => {
      const { goBack } = useRouting()

      expect(() => goBack('kits', 'kits_detail', undefined)).not.toThrow()
    })

    it('must allow objectID as null without throwing', () => {
      const { goBack } = useRouting()

      expect(() => goBack('kits', 'kits_detail', null)).not.toThrow()
    })

    it('must navigate with numeric id after validation passes', () => {
      const { goBack } = useRouting()

      goBack('kits', 'kits_detail', 42)

      expect(mockPush).toHaveBeenCalledWith({
        name: 'kits_detail',
        params: { id: 42 }
      })
    })
  })

  // ============================================================
  // 4. INTEGRATION
  // ============================================================
  describe('Integration between methods', () => {
    it('must return all three methods', () => {
      const result = useRouting()

      expect(result).toHaveProperty('goToList')
      expect(result).toHaveProperty('goToDetail')
      expect(result).toHaveProperty('goBack')
      expect(typeof result.goToList).toBe('function')
      expect(typeof result.goToDetail).toBe('function')
      expect(typeof result.goBack).toBe('function')
    })

    it('must share the same router instance across methods', () => {
      const { goToList, goToDetail, goBack } = useRouting()

      goToList('kits')
      goToDetail('kits_detail', 1)
      goBack('kits', 'kits_detail')

      expect(mockPush).toHaveBeenCalledTimes(3)
    })
  })

  // ============================================================
  // 5. REAL USE CASES
  // ============================================================
  describe('Real use cases', () => {
    it('must navigate to kits list', () => {
      const { goToList } = useRouting()

      goToList('kits')

      expect(mockPush).toHaveBeenCalledWith({ name: 'kits' })
    })

    it('must navigate to kit detail after save', () => {
      const { goToDetail } = useRouting()

      goToDetail('kits_detail', 5)

      expect(mockPush).toHaveBeenCalledWith({
        name: 'kits_detail',
        params: { id: 5 }
      })
    })

    it('must navigate back to list from creation form', () => {
      const { goBack } = useRouting()

      // When a form has no id (creation mode), objectID is undefined
      goBack('kits', 'kits_detail', undefined)

      expect(mockPush).toHaveBeenCalledWith({ name: 'kits' })
    })

    it('must navigate back to detail from edit form', () => {
      const { goBack } = useRouting()

      // When editing, the form has an id
      goBack('kits', 'kits_detail', 7)

      expect(mockPush).toHaveBeenCalledWith({
        name: 'kits_detail',
        params: { id: 7 }
      })
    })

    it('must handle order form navigation', () => {
      const { goBack } = useRouting()

      goBack('orders', 'orders_detail', 123)

      expect(mockPush).toHaveBeenCalledWith({
        name: 'orders_detail',
        params: { id: 123 }
      })
    })

    it('must handle currency detail navigation', () => {
      const { goToDetail } = useRouting()

      goToDetail('currency_detail', 1)

      expect(mockPush).toHaveBeenCalledWith({
        name: 'currency_detail',
        params: { id: 1 }
      })
    })
  })
})
