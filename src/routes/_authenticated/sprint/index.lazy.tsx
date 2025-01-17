import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/sprint/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/sprint/"!</div>
}
