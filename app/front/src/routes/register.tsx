import Register from "@/pages/registerPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: Register,
});
