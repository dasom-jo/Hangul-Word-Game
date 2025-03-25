<img src="C:\Users\jody0\Hangul-Word-Game\public\background.png" width="600" height="400" style="object-fit: cover;" />

## 1. 프로젝트 목표

AI를 통한 새로운 한글 낱말 및 영단어를 학습하고, 틀린 단어를 저장하여 복습할 수 있도록 하여 지속적인 학습 효과 제공.

## 3. 개발 환경

<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Badge" /> <img src="https://img.shields.io/badge/React-20232A.svg?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React.js Badge" /> <img src="https://img.shields.io/badge/TypeScript-007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge" /> <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=20232A" alt="JavaScript Badge" /> <img src="https://img.shields.io/badge/CSS-CC6699.svg?style=for-the-badge&logo=sass&logoColor=white" alt="CSS Badge" /> <img src="https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js Badge" /> <img src="https://img.shields.io/badge/MySQL-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL Badge" /> <img src="https://img.shields.io/badge/GitHub-181717.svg?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Badge" /><img src="https://img.shields.io/badge/Gemini_AI-E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Badge" />

## 3. 주요 기능

### [로그인 페이지]

- 타이틀
- 배경
- 카카오 로그인

<table>
  <tr>
    <td>로그인 페이지</td>
    <td><img src="C:\Users\jody0\Pictures\스크린샷\스크린샷 2025-03-04 150947.png" width="500" height="500" style="object-fit: cover;" /></td>
  </tr>
</table>

### [선택 페이지]

- 게임 시작 버튼
- 단어장 버튼
- 이동 버튼

<table>
  <tr>
    <td>선택 페이지</td>
    <td><img src="C:\Users\jody0\Pictures\스크린샷\스크린샷 2025-03-04 152357.png" width="500" height="700" style="object-fit: cover;" /></td>
  </tr>
</table>

### [게임 페이지]

- 타이머 기능
- 단어 출력 기능
- 영어 입력 INPUT
- 정답시 파란 체크
- 스코어 확인 가능

<table>
  <tr>
    <td>시작 페이지</td>
    <td><img src="C:\Users\jody0\Pictures\스크린샷\스크린샷 2025-03-04 154313.png" width="500" height="700" style="object-fit: cover;" /></td>
  </tr>
    <tr>
    <td>게임 페이지</td>
    <td><img src="C:\Users\jody0\Pictures\스크린샷\스크린샷 2025-03-04 154324.png" width="500" height="700" style="object-fit: cover;" /></td>
  </tr>
    <tr>
    <td>완료 페이지</td>
    <td><img src="C:\Users\jody0\Pictures\스크린샷\스크린샷 2025-03-04 154633.png" width="500" height="700" style="object-fit: cover;" /></td>
  </tr>
</table>

### [단어장 페이지]

- 틀린 단어 확인
- TTS 기능

<table>
  <tr>
    <td>단어장 페이지</td>
    <td><img src="C:\Users\jody0\Pictures\스크린샷\스크린샷 2025-03-04 160401.png" width="500" height="700" style="object-fit: cover;" /></td>
  </tr>
</table>

## 4. 트러블 슈팅

### ** 타이머 로직과 애니메이션의 차이**

- **원인**

  setProgress를 통해 타이머를 관리하고 있지만 해당 함수는 비동기 함수이므로 prev 값은 항상 이전 렌더링의 값을 사용. 그래서 값이 80%인 상태에 progress === 100% 조건에 참으로 평가되어 다시보기 버튼이 100%인 상태가 아니라 80%에서 생성.

- **해결**

  progress가 100%조건이 참이되어도 즉시 completed가 true가 되지 않도록 setTimeout을 활용하여 UI 애니메이션이 끝난 뒤 버튼이 나타나도록 조정.

- **알게 된 점**

  상태 변경과 UI 업데이트 간의 타이밍을 적절히 조정하는 방법 학습

### **  렌더링 중 상태 업데이트 **

- **원인**

  React는 setProgress 콜백 내부에서  setCompleted가 발생하는 것을 감지. 또한 stopTimer()가 Zustand store를 업데이트하면서 useTimerStore를 통해 추가적인 리렌더링이 트리거. 이로 인해 React가 '렌더링 도중 상태를 변경할 수 없다'는 오류가 발생.

- **해결**

  React는 현재 상태로 TimerBar 렌더링을 완료 후 stopTimer(), setProgress(100),setCompleted(true) 가 실행되어 업데이트된 상태로 새 렌더링을 트리거. 

- **알게 된 점**

  렌더링 중 상태 업데이트를 막기 위해 렌더링 이후에 실행되도록 조정 및 전역 상태 관리 라이브러리를 사용할 때는 리렌더링을 방지해야함을 인지.

### ** 무한 루프 문제 **

- **원인**

      Maximum update depth exceeded

  requestAnimationFrame(updateWords)을 호출하는데, updateWords 내에서 setWords를 호출하기 때문에 setWords가 상태를 변경되며 다시 useEffect가 실행되며 무한 루프 에러 발생.

- **해결**

  useRef로 requestAnimationFrame ID를 저장해 불필요한 재등록을 방지하고, isRunning이 false일 때 실행을 막아 무한 루프를 차단. 또한, setWords를 의존성 배열에서 제거해 상태 변경으로 인한 useEffect 재실행을 방지. 

- **알게 된 점**

  useRef를 활용해 상태 변경 없이 값을 유지하며 불필요한 리렌더링을 방지하는 방법과, useEffect 의존성 배열을 신중하게 관리해 무한 루프를 방지 법 학습.

## 7. 개발 후기

AI 기술 접목을 처음해봐 어려움이 있었지만 오히려 MEXT.JS의 구조를 깊이 이해하는데 도움이 되었습니다.
또한 게임을 주제로 정한 이유는 사용자 경험 개선을 최우선으로 두고 싶어 사용자의 흐름에 방해가 되지않도록 기능 구현과 애니메이션에
심혈을 기울였습니다.
AI API는 무료 버전을 사용해 할당량에 자주 도달하여 ERROR 가 떳지만 오히려 그런 에러를 막기위한 또 다른 조건을 추가하여
좀더 여러 에러에 대처하는 방법을 배웠습니다.

# 시현 영상( 중간 에러는 AI 무료 버전으로 할당량을 전부 채워 요청이 거부된 상태입니다.

# 그래서 기본 데이터를 출력하였습니다. )

"C:\Users\jody0\Videos\화면 녹화\화면 녹화 중 2025-03-04 211214.mp4"
