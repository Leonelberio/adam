"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  countryId: z.string().min(1, "Country is required"),
});

export default function SignupForm() {
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    // Fetch the list of countries
    fetch("/api/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, []);

  const onSubmit = async (data: { name: string; email: string; password: string; countryId: string }) => {
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const result = await res.json();
      setError(result.error || "An error occurred");
      return;
    }

    alert("Registration successful! You can now log in.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name</label>
        <Input {...register("name")} placeholder="Name" />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <label>Email</label>
        <Input {...register("email")} placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label>Password</label>
        <Input {...register("password")} type="password" placeholder="Password" />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <div>
        <label>Country</label>
        <select {...register("countryId")}>
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.countryId && <p>{errors.countryId.message}</p>}
      </div>
      {error && <p>{error}</p>}
      <Button type="submit">Sign Up</Button>
    </form>
  );
}
