"use client";
import { useSession } from "next-auth/react";

export const useUserDB = () => {
  const { data: session } = useSession();

  const handleUser = async () => {
    if (!session?.user?.name) return;

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kakaoid: session.user.name,
        }),
      });

      const data = await response.json();
      console.log("유저 처리 결과:", data);
    } catch (error) {
      console.error("유저 처리 실패:", error);
    }
  };

  return { handleUser };
};
