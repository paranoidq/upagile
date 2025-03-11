import { IconFlag3, IconFlag3Filled } from '@tabler/icons-react'

export const PRIORITIES = [
  {
    label: 'Low',
    value: 'LOW',
    icon: IconFlag3,
    color: 'text-green-500',
  },
  {
    label: 'Medium',
    value: 'MEDIUM',
    icon: IconFlag3,
    color: 'text-blue-500',
  },
  {
    label: 'High',
    value: 'HIGH',
    icon: IconFlag3,
    color: 'text-orange-500',
  },
  {
    label: 'Critical',
    value: 'CRITICAL',
    icon: IconFlag3Filled,
    color: 'text-red-300',
  },
  {
    label: 'Blocker',
    value: 'BLOCKER',
    icon: IconFlag3Filled,
    color: 'text-red-800',
  },
]
