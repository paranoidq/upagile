import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/backlog/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/backlog/"!</div>
}
