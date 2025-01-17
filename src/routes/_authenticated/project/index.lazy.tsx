import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/project/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/project/"!</div>
}
