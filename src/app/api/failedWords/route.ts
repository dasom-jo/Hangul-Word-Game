import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/api/db"; // MySQL 연결
import { RowDataPacket } from "mysql2";

interface faileWords extends RowDataPacket {
  kr: string;
  en: string;
}

export async function GET() {
    try {
      const words = await query<faileWords[]>("SELECT kr,en FROM falsehangul");
      console.log("Fetched users:",words); // 데이터 확인
      return NextResponse.json(words);
    } catch (error) {
      console.error("DB 요청 실패:", error);
      return NextResponse.json({ error: "DB 요청 실패" }, { status: 500 });
    }
  }

export async function POST(req: NextRequest) {
  try {
    const { words } = await req.json(); // 클라이언트에서 보낸 단어 목록 받기

    if (!Array.isArray(words) || words.length === 0) {
      return NextResponse.json({ error: "유효한 단어 목록이 필요합니다." }, { status: 400 });
    }

    // 단어 데이터 준비
    const values = words.map(({ korean, english }) => [korean, english]);

    // QL 문법 조정: 단어 개수에 맞게 `VALUES (?, ?), (?, ?)` 생성
    const placeholders = values.map(() => "(?, ?)").join(", ");
    const flatValues = values.flat();

    // SQL 실행
    await query(`INSERT INTO falsehangul (kr, en) VALUES ${placeholders}`, flatValues);

    return NextResponse.json({ message: "실패한 단어 저장 완료" });
  } catch (error) {
    console.error("DB 저장 실패:", error);
    return NextResponse.json({ error: "DB 저장 실패" }, { status: 500 });
  }
}
