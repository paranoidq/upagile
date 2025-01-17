import { createLazyFileRoute } from '@tanstack/react-router'
import Issue from '@/features/issue'

export const Route = createLazyFileRoute('/_authenticated/issue/')({
  component: Issue,
})
