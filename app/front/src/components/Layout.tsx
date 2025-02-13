import { Outlet } from "@tanstack/react-router";
import { SiteHeader } from "@/components/header";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-grow p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
