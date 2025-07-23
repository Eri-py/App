import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "../../features/home/components/Navbar";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Navbar onMenuClick={() => {}} onSearchClick={() => {}} />
    </div>
  );
}
