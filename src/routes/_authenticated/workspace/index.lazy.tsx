import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/workspace/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/workspace/"!</div>
}
