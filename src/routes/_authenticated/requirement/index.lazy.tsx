import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/requirement/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/requirement/"!</div>
}
