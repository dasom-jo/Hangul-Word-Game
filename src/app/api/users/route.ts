import { query } from "@/app/api/db";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

interface User extends RowDataPacket {
  kakaoid: string;
}

export async function GET() {
    try {
      const users = await query<User[]>("SELECT kakaoid FROM user");
      console.log("Fetched users:", users); // 🚀 데이터 확인
      return NextResponse.json(users);
    } catch (error) {
      console.error("DB 요청 실패:", error);
      return NextResponse.json({ error: "DB 요청 실패" }, { status: 500 });
    }
  }
