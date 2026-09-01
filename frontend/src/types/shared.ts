export interface PaginatedResponse<T> {
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

export interface DeleteModalField {
  key: string
  label: string
  value: string | number | null | undefined
}
