// types/task.ts

export interface Task {
  id: number
  statement: string
  done: boolean
  date: string // ISO date string (e.g., '2025-09-25')
  order: number // for manual sorting later
}
