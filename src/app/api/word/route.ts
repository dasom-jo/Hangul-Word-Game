import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
    }

    // Gemini API 요청
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: "한글 명사 10개와 각 명사의 영어 번역을 {한글: '명사', 영어: 'noun'} 형식으로 제공하되 이미 제공한 단어는 제공하지 말아줘.결과는 JSON 배열로 반환해줘. 예: [{한글: '사과', 영어: 'apple'}, {한글: '바나나', 영어: 'banana'}, ...].",
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini API 응답 데이터:", data); // 응답 확인

    if (!data.candidates || data.candidates.length === 0) {
      console.error("Gemini API 응답이 비어 있습니다:", data);
      return NextResponse.json(
        { error: "단어를 가져올 수 없습니다." },
        { status: 500 }
      );
    }

    const word = data.candidates[0]?.content?.parts[0]?.text?.trim() || "한국";
    return NextResponse.json({ word });
  } catch (error) {
    console.error("Gemini 단어 생성 오류:", error);
    return NextResponse.json(
      { error: "단어를 가져올 수 없습니다." },
      { status: 500 }
    );
  }
}
