import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/trade")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>User is trying to trade</div>;
}
