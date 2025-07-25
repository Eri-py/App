import { Navbar } from "@/features/home/components/Navbar";
import { createFileRoute } from "@tanstack/react-router";

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
