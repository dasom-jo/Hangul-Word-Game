import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/api/db"; // MySQL 연결
import { RowDataPacket } from "mysql2";

interface faileWords extends RowDataPacket {
  kr: string;
  en: string;
  kakaoid:string;
}
//단어를 디비로 보내는 코드
export async function GET() {
    try {
      const words = await query<faileWords[]>("SELECT kr,en,kakaoid FROM falsehangul");
      console.log("Fetched users:",words); // 데이터 확인
      return NextResponse.json(words);
    } catch (error) {
      console.error("DB 요청 실패:", error);
      return NextResponse.json({ error: "DB 요청 실패" }, { status: 500 });
    }
  }
  export async function POST(req: NextRequest) {
    try {
      const { words, kakaoid } = await req.json();

      console.log("🔍 서버로 전달된 데이터:", { words, kakaoid }); // ✅ 데이터 확인용 로그 추가

      if (!kakaoid) {
        console.error("❌ 유저 ID가 누락됨!");
        return NextResponse.json({ error: "유저 ID가 필요합니다." }, { status: 400 });
      }

      if (!Array.isArray(words) || words.length === 0) {
        console.error("❌ words 배열이 비어 있음!");
        return NextResponse.json({ error: "유효한 단어 목록이 필요합니다." }, { status: 400 });
      }

      const values = words.map(({ korean, english }) => [korean, english, kakaoid]);

      const placeholders = values.map(() => "(?, ?, ?)").join(", ");
      const flatValues = values.flat();

      await query(`INSERT INTO falsehangul (kr, en, kakaoid) VALUES ${placeholders}`, flatValues);

      return NextResponse.json({ message: "실패한 단어 저장 완료" });
    } catch (error) {
      console.error("❌ DB 저장 실패:", error);
      return NextResponse.json({ error: "DB 저장 실패" }, { status: 500 });
    }
  }
