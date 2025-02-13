import { Outlet } from "@tanstack/react-router";
import { SiteHeader } from "@/components/header";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-grow max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
