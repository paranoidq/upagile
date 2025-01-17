import { createLazyFileRoute } from '@tanstack/react-router'
import Workspace from '@/features/workspace'

export const Route = createLazyFileRoute('/_authenticated/workspace/')({
  component: Workspace,
})
