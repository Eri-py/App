import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create")({
  component: Create,
});

function Create() {
  return <div>User is trying to create a post</div>;
}
