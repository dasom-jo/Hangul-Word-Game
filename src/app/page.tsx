"use client";

import { useEffect, useState } from "react";

type User = { kakaoid: string;};

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div>
      <h1>사용자 목록</h1>
      <ul>
        {users.map((user) => (
          <li key={user.kakaoid}>{user.kakaoid}</li>
        ))}
      </ul>
    </div>
  );
}
