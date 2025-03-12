import { IconFlag3, IconFlag3Filled } from '@tabler/icons-react'

export const PRIORITIES = [
  {
    label: 'LOW',
    value: 'LOW',
    icon: IconFlag3,
    color: 'text-green-500',
  },
  {
    label: 'MEDIUM',
    value: 'MEDIUM',
    icon: IconFlag3,
    color: 'text-blue-500',
  },
  {
    label: 'HIGH',
    value: 'HIGH',
    icon: IconFlag3,
    color: 'text-orange-500',
  },
  {
    label: 'CRITICAL',
    value: 'CRITICAL',
    icon: IconFlag3Filled,
    color: 'text-red-300',
  },
  {
    label: 'BLOCK',
    value: 'BLOCKER',
    icon: IconFlag3Filled,
    color: 'text-red-800',
  },
]
