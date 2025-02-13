import React, { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
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

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("[Login] Form submitted");
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    console.log("[Login] Collected data:", { email, password });

    try {
      console.log("[Login] Sending request to http://localhost:8080/login");
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("[Login] Response received with status:", response.status);
      if (response.status === 200) {
        const data = await response.json();
        console.log("[Login] Login successful:", data);
        localStorage.setItem("token", data.token);
        console.log("[Login] Token saved in localStorage, redirecting to '/'");
        navigate({ to: "/" });
      } else {
        const errorData = await response.json();
        console.error(
          "[Login] Login failed. Status:",
          response.status,
          "Error data:",
          errorData
        );
        throw new Error(errorData.message || "Login failed");
      }
    } catch (err: any) {
      console.error("[Login] Error caught during login:", err);
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
      console.log("[Login] Login process completed");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <LoginForm onSubmit={handleSubmit} />
      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
