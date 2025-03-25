import { query } from "../app/api/db"; // MySQL 연결 함수
import { RowDataPacket } from "mysql2";

// 유저 데이터 타입 정의
interface User extends RowDataPacket {
  kakaoid: string;
}

// 유저 조회 (DB에 존재하는지 확인)
export async function getUserByKakaoId(kakaoid: string): Promise<User | null> {
  try {
    const users = (await query<User[]>("SELECT * FROM user WHERE kakaoid = ?", [
      kakaoid,
    ])) as User[];
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error("유저 조회 실패:", error);
    return null;
  }
}

// 유저 저장 (새로운 유저일 경우)
export async function saveUser(kakaoid: string) {
  try {
    await query("INSERT INTO user (kakaoid) VALUES (?)", [kakaoid]);
    return { success: true };
  } catch (error) {
    console.error("유저 저장 실패:", error);
    return { success: false, error };
  }
}
