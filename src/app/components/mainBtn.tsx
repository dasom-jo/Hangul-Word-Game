"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import styles from "./mainBtn.module.css";
import { Menu } from "lucide-react";

const MainBtn = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.menuWrapper}>
      {/* 메뉴 아이콘 버튼 */}
      <button className={styles.menuButton} onClick={() => setIsOpen(!isOpen)}>
        <Menu />
      </button>

      {/* 메뉴 컨텐츠 */}
      {isOpen && (
        <div className={styles.menuContent}>
          <button onClick={() => router.push("/")}>홈 | home</button>
          <button onClick={() => router.push("/study")}>단어장 | study</button>
          <button onClick={() => router.push("/game")}>게임 | game</button>
          <button onClick={() => signOut({ callbackUrl: "/" })}>나가기 | logout</button>
        </div>
      )}
    </div>
  );
};

export default MainBtn;
