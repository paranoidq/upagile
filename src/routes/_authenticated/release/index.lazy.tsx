import { createLazyFileRoute } from '@tanstack/react-router'
import Release from '@/features/release'

export const Route = createLazyFileRoute('/_authenticated/release/')({
  component: Release,
})
