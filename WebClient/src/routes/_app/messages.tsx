import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/messages")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>User opened their messages</div>;
}
