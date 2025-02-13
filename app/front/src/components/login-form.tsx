import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Formulaire de login soumis");

    // Récupération des valeurs du formulaire
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log("Email saisi :", email);
    console.log("Mot de passe saisi :", password);

    try {
      console.log("Envoi de la requête API pour le login");
      const response = await fetch("http://localhost:8082/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        console.error("Le login a échoué");
        // Vous pouvez afficher un message d'erreur à l'utilisateur ici
        return;
      }

      console.log("Login réussi !");
      // Récupérer les données renvoyées par le serveur (exemple : token)
      const data = await response.json();

      // Vérifiez que la réponse contient bien un token
      if (data.token) {
        await login({ id: email, email }, data.token);
      } else {
        console.warn("Aucun token reçu dans la réponse");
      }

      console.log("Redirection vers la page d'accueil");
      navigate({ to: "/" });
    } catch (error) {
      console.error("Erreur lors du login :", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
