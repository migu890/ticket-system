import {
  describe,
  expect,
  it
} from 'vitest'

import {
  createSessionToken,
  hashSessionToken
} from './tokenService.js'

describe('tokenService', () => {
  it('erstellt unterschiedliche Session-Tokens', () => {
    const token1 = createSessionToken()
    const token2 = createSessionToken()

    expect(token1).not.toBe(token2)
  })

  it('erzeugt für denselben Token denselben Hash', () => {
    const token = 'test-token'

    const hash1 = hashSessionToken(token)
    const hash2 = hashSessionToken(token)

    expect(hash1).toBe(hash2)
  })

  it('speichert den ursprünglichen Token nicht direkt', () => {
    const token = 'test-token'

    const hash = hashSessionToken(token)

    expect(hash).not.toBe(token)
  })
})