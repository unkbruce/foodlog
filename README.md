# FoodLog

FoodLog는 사용자가 먹은 음식을 간단히 기록하고, 기록된 데이터를 바탕으로 식단 피드백을 확인할 수 있는 MVP 웹 애플리케이션입니다. 프론트엔드는 React와 Vite로 구성되어 있으며, 백엔드는 Express 기반의 인메모리 API로 동작합니다.

## 주요 기능

- 음식 기록 목록 조회
- 음식 기록 추가
- 음식 기록 상세 조회
- 음식 기록 수정 및 삭제
- 총 기록 수, 총 칼로리, 카테고리 요약 기반 식단 피드백 확인

## 기술 스택

- Frontend: React, Vite
- Backend: Express
- Styling: CSS
- Lint: ESLint

## 실행 방법

의존성을 설치합니다.

```bash
npm install
```

백엔드 API 서버를 실행합니다.

```bash
npm run server
```

다른 터미널에서 프론트엔드 개발 서버를 실행합니다.

```bash
npm run dev
```

Vite 개발 서버는 `/api` 요청을 `http://localhost:3000` 백엔드 서버로 프록시합니다.

## 백엔드 API 목록

| Method | Endpoint | 설명 |
| --- | --- | --- |
| GET | `/foods` | 음식 기록 목록 조회 |
| GET | `/foods/:id` | 음식 기록 상세 조회 |
| POST | `/foods` | 음식 기록 추가 |
| PUT | `/foods/:id` | 음식 기록 수정 |
| DELETE | `/foods/:id` | 음식 기록 삭제 |
| GET | `/feedback` | 식단 피드백 조회 |

## 기획 문서

- [FoodLog PRD](docs/01_FoodLog_PRD.md)
- [FoodLog 요구사항 정의서](docs/02_FoodLog_Requirements.md)
- [FoodLog 사용자 시나리오](docs/03_FoodLog_UserScenario.md)
- [FoodLog 와이어프레임](docs/04_FoodLog_Wireframe.md)

HTML 문서는 `docs/html` 경로에서 확인할 수 있습니다. PDF 문서가 추가되는 경우 `docs/pdf` 경로에서 확인하면 됩니다.
