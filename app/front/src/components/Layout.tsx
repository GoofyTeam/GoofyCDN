import { Outlet } from "@tanstack/react-router";
import { SiteHeader } from "@/components/header";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
