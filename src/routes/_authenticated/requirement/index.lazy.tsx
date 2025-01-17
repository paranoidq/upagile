import { createLazyFileRoute } from '@tanstack/react-router'
import Requirement from '@/features/requirement'

export const Route = createLazyFileRoute('/_authenticated/requirement/')({
  component: Requirement,
})
