export const sum = (a: number, b: number): number => a + b

export const greet = (name: string): string => `Hello ${name}`

export interface User {
  id: number | string
  firstName: string
  email?: string
}
