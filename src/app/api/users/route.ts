import { query } from "@/app/api/db";
import { RowDataPacket } from "mysql2";
import { saveUser, getUserByKakaoId } from "../../../services/authService";
import { NextRequest, NextResponse } from "next/server";
interface User extends RowDataPacket {
  kakaoid: string;
}

export async function GET() {
    try {
      const users = await query<User[]>("SELECT kakaoid FROM user");
      console.log("Fetched users:", users); // 데이터 확인
      return NextResponse.json(users);
    } catch (error) {
      console.error("DB 요청 실패:", error);
      return NextResponse.json({ error: "DB 요청 실패" }, { status: 500 });
    }
  }
// 로그인한 유저 정보 확인 및 저장
export async function POST(req: NextRequest) {
  try {
    const { kakaoid} = await req.json();
    if (!kakaoid) {
      return NextResponse.json({ error: "kakaoid가 필요합니다" }, { status: 400 });
    }

    // DB에서 유저 확인
    const existingUser = await getUserByKakaoId(kakaoid);

    if (existingUser) {
      return NextResponse.json({ message: "이미 존재하는 유저입니다", user: existingUser });
    } else {
      // 새로운 유저 저장
      const result = await saveUser(kakaoid);
      return NextResponse.json({ message: "유저 저장 완료", success: result.success });
    }
  } catch (error) {
    console.error("DB 처리 실패:", error);
    return NextResponse.json({ error: "DB 처리 실패" }, { status: 500 });
  }
}