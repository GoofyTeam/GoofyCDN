import { SiteHeader } from "@/components/header";
import React from "react";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="p-4">page de test</div>
    </div>
  );
};

export default Index;
