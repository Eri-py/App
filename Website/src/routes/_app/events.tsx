import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/events")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>User is trying to view events</div>;
}
