//import { useEffect } from 'react';
import { create } from "zustand";
import { persist } from "zustand/middleware";

//const [users, fetchUsers] = useUserStore();
// useEffect(()=>{
//     fetchUsers();
// },[fetchUsers])

interface User {
  kakaoid: string;
}

interface UserStore {
  users: User[];
  fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      users: [],
      fetchUsers: async () => {
        try {
          const response = await fetch("/api/users");
          const data = await response.json();
          set({ users: data });
        } catch (error) {
          console.error("Failed to fetch users:", error);
        }
      },
    }),
    { name: "user-store" }, // 로컬 스토리지 키
  ),
);
