import { createLazyFileRoute } from '@tanstack/react-router'
import Backlog from '@/features/backlog'

export const Route = createLazyFileRoute('/_authenticated/backlog/')({
  component: Backlog,
})
