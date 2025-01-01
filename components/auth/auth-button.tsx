"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { useState } from "react";
import { UserButton } from "./user-button";

export function AuthButton() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  if (session) {
    return <UserButton />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {mode === "login" ? (
          <>
            <LoginForm onSuccess={() => setIsOpen(false)} />
            <Button
              variant="link"
              onClick={() => setMode("signup")}
              className="mt-4"
            >
              Don't have an account? Sign up
            </Button>
          </>
        ) : (
          <>
            <SignupForm
              onSignup={() => {
                setMode("login");
              }}
              onClose={() => setIsOpen(false)}
            />
            <Button
              variant="link"
              onClick={() => setMode("login")}
              className="mt-4"
            >
              Already have an account? Sign in
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}