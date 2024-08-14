"use client";

import { signIn } from "next-auth/react";

export const handleLogIn = async () => {
  // Redirect to Keycloak login
  const result = await signIn("keycloak", { redirect: false });

  if (result?.ok) {
    // Successfully signed in, now add the user as an assistant
    const response = await fetch("/api/data/add-assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: result?.user?.email }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Assistant added successfully.");
    } else {
      alert(data.message || "Failed to add assistant.");
    }
  } else {
    alert("Failed to log in.");
  }
};
