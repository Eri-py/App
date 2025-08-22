import { createFileRoute } from "@tanstack/react-router";
import { PostTile } from "@/shared/components/PostTile";

export const Route = createFileRoute("/_app/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <PostTile />
      <PostTile />
      <PostTile />
      <PostTile />
    </>
  );
}
