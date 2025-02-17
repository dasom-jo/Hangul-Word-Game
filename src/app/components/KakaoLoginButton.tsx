"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./KakaoLoginButton.module.css";

const KakaoLoginButton = () => {
  const { data: session } = useSession();
  console.log( "세션 정보",session);

  return (
    <div>
      {session ? (
        <div>
          <p>환영합니다, {session.user?.name}님!</p>
          <button onClick={() => signOut()}>로그아웃</button>
        </div>
      ) : (
        <button
        className={styles.btn}
        onClick={() => signIn("kakao")}>카카오 로그인</button>
      )}
    </div>
  );
};

export default KakaoLoginButton;
