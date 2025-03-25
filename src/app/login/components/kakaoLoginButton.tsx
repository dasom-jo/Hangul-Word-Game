"use client";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import styles from "../kakaoLoginButton.module.css";
import Select from "../../select/page";
import { useUserDB } from "../hooks/useUserDB";
import MainBtn from "../../components/mainBtn";

const KakaoLoginButton = () => {
  const { data: session } = useSession();
  console.log(session);
  const { handleUser } = useUserDB();

  useEffect(() => {
    if (session?.user?.name) {
      handleUser(); // 로그인한 유저를 DB에 저장 (중복 검사 포함)
    }
  }, [handleUser, session]); // 세션 정보가 바뀔 때마다 실행

  return (
    <div>
      {session ? (
        <div>
          <MainBtn />
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
