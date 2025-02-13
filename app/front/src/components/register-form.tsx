import React, { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Sign up by providing your email and password
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
          Register
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("[Register] Form submitted");
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    console.log("[Register] Collected data:", { email, password });

    try {
      console.log(
        "[Register] Sending request to http://localhost:8082/register"
      );
      const response = await fetch("http://localhost:8082/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Attention : l'API attend "Email" et "Password" avec une majuscule
        body: JSON.stringify({ Email: email, Password: password }),
      });

      console.log("[Register] Response received with status:", response.status);
      if (response.status === 200) {
        const data = await response.json();
        console.log("[Register] Registration successful:", data);
        console.log("[Register] Redirecting to '/login'");
        navigate({ to: "/login" });
      } else {
        const errorData = await response.json();
        console.error(
          "[Register] Registration failed. Status:",
          response.status,
          "Error data:",
          errorData
        );
        throw new Error(errorData.message || "Registration failed");
      }
    } catch (err: any) {
      console.error("[Register] Error caught during registration:", err);
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
      console.log("[Register] Registration process completed");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <RegisterForm onSubmit={handleSubmit} />
      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
