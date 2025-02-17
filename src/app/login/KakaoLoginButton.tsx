"use client";
import { signIn,signOut, useSession } from "next-auth/react";
import styles from "./KakaoLoginButton.module.css";
import Select from "../select/page";

const KakaoLoginButton = () => {
  const { data: session } = useSession();
  console.log("세션 정보", session);

  return (
    <div>
      {session ? (
        <div>
          {/* <div className={styles.speech}>
            <div className={styles.speechText}>환영합니다, {session.user?.name}님!</div>
          </div> */}
          <button className={styles.btn} onClick={() => signOut()}>
            로그아웃
          </button>
          <Select />
        </div>
      ) : (
        <button
          aria-label="카카오 로그인"
          className={styles.btn}
          onClick={() => signIn("kakao")}
        >
          카카오 로그인
        </button>
      )}
    </div>
  );
};

export default KakaoLoginButton;
