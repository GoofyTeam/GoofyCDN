import { createFileRoute } from "@tanstack/react-router";

//Routes to access specific folders and subfolders $folderPath is the PATH of the folder
export const Route = createFileRoute("/_authenticated/drive/$folderPath")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/$folderPath/$folderPath"!</div>;
}
