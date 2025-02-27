export const fetchFailedWords = async () => {
    try{
        const response = await fetch("/api/failedWords");
        if(!response.ok){
            throw new Error("서버요청 실패");
        }
        return await response.json();
    }catch(error) {
        console.error("단어 목록 가져오기 실패" , error);
        return [];
    }
}