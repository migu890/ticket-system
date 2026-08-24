import {
  describe,
  expect,
  it
} from 'vitest'

import { app } from '../app.js'

describe('GET /health', () => {
  it('liefert HTTP 200', async () => {
    const response = await app.request('/health')

    expect(response.status).toBe(200)
  })

  it('liefert den Status ok', async () => {
    const response = await app.request('/health')

    const body = await response.json()

    expect(body).toEqual({
      status: 'ok'
    })
  })
})