import { describe, expect, test } from 'vitest'
import { sum } from '@/utils/helloTS'

describe('sum util', () => {
  test('Utils sum should... well sum', () => {
    expect(sum(4, 4)).toBe(9)
  })
})
