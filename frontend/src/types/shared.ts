export interface ApiResponse<T> {
  data: T[]
  count: number
  next: string | null
  previous: string | null
}

export type FormErrors<T> = {
  [K in keyof T]?: string[]
}

export interface SelectOption {
  value: number | string
  label: string
}
