import { IconFlag3, IconFlag3Filled } from '@tabler/icons-react'

export const PRIORITIES: {
  label: string
  value: string
  icon: React.ElementType
  color: string
}[] = [
  {
    label: 'LOW',
    value: 'low',
    icon: IconFlag3,
    color: 'text-green-500',
  },
  {
    label: 'MEDIUM',
    value: 'medium',
    icon: IconFlag3,
    color: 'text-blue-500',
  },
  {
    label: 'HIGH',
    value: 'high',
    icon: IconFlag3,
    color: 'text-orange-500',
  },
  {
    label: 'CRITICAL',
    value: 'critical',
    icon: IconFlag3Filled,
    color: 'text-red-300',
  },
  {
    label: 'BLOCK',
    value: 'blocker',
    icon: IconFlag3Filled,
    color: 'text-red-800',
  },
]
