import { createLazyFileRoute } from '@tanstack/react-router'
import Sprint from '@/features/sprint'

export const Route = createLazyFileRoute('/_authenticated/sprint/')({
  component: Sprint,
})
