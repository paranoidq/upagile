import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/release/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/release/"!</div>
}
