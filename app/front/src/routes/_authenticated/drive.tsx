import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/drive')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/"!</div>
}
