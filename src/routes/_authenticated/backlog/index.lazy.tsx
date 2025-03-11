import { createLazyFileRoute } from '@tanstack/react-router'
import BacklogPage from '@/features/backlog'

export const Route = createLazyFileRoute('/_authenticated/backlog/')({
  component: BacklogPage,
})
