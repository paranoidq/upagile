import { z } from 'zod'

export const PRIORITIES: {
  label: string
  value: string
  color: string
}[] = [
  {
    label: 'LOW',
    value: 'low',
    color: 'text-green-500',
  },
  {
    label: 'MEDIUM',
    value: 'medium',
    color: 'text-blue-500',
  },
  {
    label: 'HIGH',
    value: 'high',
    color: 'text-orange-500',
  },
  {
    label: 'CRITICAL',
    value: 'critical',
    color: 'text-red-300',
  },
  {
    label: 'BLOCK',
    value: 'blocker',
    color: 'text-red-800',
  },
]

export const prioritySchema = z.enum(PRIORITIES.map((priority) => priority.value) as [string, ...string[]])
