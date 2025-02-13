import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function SiteHeader() {
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
    <header className="border-grid sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 flex items-center justify-end">
      <Popover>
        <PopoverTrigger>
          <Avatar>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col items-center gap-2">
            {email ? email : "Utilisateur"}
            <button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Déconnexion
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
}
