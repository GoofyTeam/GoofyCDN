import FolderComponent from "@/components/folder";
import { SiteHeader } from "@/components/header";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("Token absent, redirection vers la page de login");
      navigate({ to: "/login" });
    } else {
      setEmail(user?.email ?? "");
    }
  }, [isAuthenticated, navigate, user?.email]);

  const handleLogout = async () => {
    await logout();
    console.log("Utilisateur déconnecté, redirection vers la page de login");
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="p-4">
        <h1 className="text-2xl font-bold">
          Bienvenue {email ? email : "Utilisateur"} !
        </h1>
        <p className="mt-2">
          Contenu protégé accessible uniquement aux utilisateurs authentifiés.
        </p>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Déconnexion
        </button>

        <FolderComponent
          folderName="Documents"
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
};

export default Index;
