import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/issue/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/issue/"!</div>
}
