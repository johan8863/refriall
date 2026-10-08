// services/__tests__/envDiagnostic.spec.ts
import { describe, it, expect } from 'vitest'
import { kitAPIEnvs } from '@/settings/env'

describe('env diagnostic', () => {
  it('must have the kit URL loaded', () => {
    console.log('kitAPIEnvs.kitUrl:', kitAPIEnvs.kitUrl)
    expect(kitAPIEnvs.kitUrl).toBeDefined()
  })
})
