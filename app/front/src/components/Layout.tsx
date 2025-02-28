import { Outlet, useLocation } from "@tanstack/react-router";
import { SiteHeader } from "@/components/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { Toaster } from "@/components/ui/toaster";

const Layout: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />
      <SiteHeader />
      <div className="w-full py-8 px-8 sm:px-12 lg:px-20">
        <Breadcrumb>
          <BreadcrumbList>
            {pathnames.map((value, index) => {
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;
              return (
                <React.Fragment key={to}>
                  {index !== 0 && <BreadcrumbSeparator />}{" "}
                  {/* Ajout de la condition pour éviter le séparateur avant le premier élément */}
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={to}
                      className={` ${isLast ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {value}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
