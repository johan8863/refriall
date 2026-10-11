/**
 * Creates a mock JWT with the given payload.
 * The signature is fake, but jwtDecode only reads the payload, not the signature.
 */
export const createMockJwt = (payload: Record<string, unknown>): string => {
  const header = { alg: 'HS256', typ: 'JWT' }
  const encode = (obj: Record<string, unknown>) =>
    btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

  return `${encode(header)}.${encode(payload)}.mock-signature`
}

/**
 * Creates a valid, non-expired JWT for tests.
 */
export const createValidJwt = (userId = 1): string =>
  createMockJwt({
    token_type: 'refresh',
    exp: 9999999999,
    iat: 1700000000,
    jti: 'mock-jti',
    user_id: userId
  })

/**
 * Creates an expired JWT for tests.
 */
export const createExpiredJwt = (userId = 1): string =>
  createMockJwt({
    token_type: 'refresh',
    exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour behind
    iat: 1700000000,
    jti: 'mock-jti',
    user_id: userId
  })
