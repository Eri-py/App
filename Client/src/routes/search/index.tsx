import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const validSearchSchema = z.object({
  q: z.string(),
});

export const Route = createFileRoute("/search/")({
  component: Search,
  validateSearch: validSearchSchema,
});

function Search() {
  const { q } = Route.useSearch();

  return (
    <div>
      Searching for <b>{q}</b>
    </div>
  );
}
