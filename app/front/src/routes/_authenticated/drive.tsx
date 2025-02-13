import { FileExplorerLayout } from "@/pages/FileExplorerLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/drive")({
  component: FileExplorerLayout,
});
