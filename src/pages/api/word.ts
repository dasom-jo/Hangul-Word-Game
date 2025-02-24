import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
//구글 gemini ai api 를 이용함
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY가 설정되지 않았습니다.");
      return res.status(500).json({ error: "API 키가 설정되지 않았습니다." });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `한글 명사 7개와 각 명사의 영어 번역을 ["한글", "영어"] 형식의 JSON 배열로 반환해줘.
              이미 제공한 단어는 포함하지 마.
              결과는 반드시 JSON 배열 형식으로 반환해야 해. 예: [["사과", "apple"], ["바나나", "banana"], ["고양이", "cat"], ["집", "house"]]`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API 응답 오류:", response.status, errorData);
      return res.status(response.status).json({ error: "Gemini API 요청 실패" });
    }

    const data = await response.json();
    console.log("Gemini API 응답 데이터:", data);

    const candidates = data.candidates;
    if (!candidates || candidates.length === 0) {
      console.error("Gemini API 응답이 비어 있습니다:", data);
      return res.status(500).json({ error: "단어를 가져올 수 없습니다." });
    }

    const content = candidates[0]?.content?.parts[0]?.text;
    if (!content) {
      console.error("Gemini API 응답 내용이 없습니다:", data);
      return res.status(500).json({ error: "단어를 가져올 수 없습니다." });
    }

    const word = content.trim();
    res.status(200).json({ word });
  } catch (error) {
    console.error("Gemini 단어 생성 오류:", error);
    res.status(500).json({ error: "단어를 가져올 수 없습니다." });
  }
}