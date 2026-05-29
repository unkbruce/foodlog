# FoodLog

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white)

FoodLog는 사용자가 먹은 음식을 간단히 기록하고, 기록된 데이터를 바탕으로 식단 피드백을 확인할 수 있는 **식단 기록 MVP 웹 애플리케이션**입니다.

음식 이름, 카테고리, 칼로리 정보를 등록하고 목록/상세/수정/삭제 기능을 통해 기록을 관리할 수 있습니다. 또한 기록된 음식 데이터를 기준으로 총 기록 수, 총 칼로리, 카테고리별 요약을 확인하고 간단한 식단 피드백을 제공합니다.

현재 버전은 MVP 구조로, 데이터베이스 없이 Express 서버의 인메모리 배열을 사용하여 CRUD 흐름을 구현했습니다.

---

## 주요 문서

| 문서 | Markdown | PDF |
| --- | --- | --- |
| PRD | [보기](docs/01_FoodLog_PRD.md) | [PDF](docs/pdf/01_FoodLog_PRD.pdf) |
| 요구사항 정의서 | [보기](docs/02_FoodLog_Requirements.md) | [PDF](docs/pdf/02_FoodLog_Requirements.pdf) |
| 사용자 시나리오 | [보기](docs/03_FoodLog_UserScenario.md) | [PDF](docs/pdf/03_FoodLog_UserScenario.pdf) |
| 와이어프레임 | [보기](docs/04_FoodLog_Wireframe.md) | [PDF](docs/pdf/04_FoodLog_Wireframe.pdf) |

HTML 문서는 `docs/html` 경로에서 확인할 수 있습니다.

---

## 프로젝트 목적

이 프로젝트는 React 프론트엔드와 Express 백엔드 API를 연결하여 기본적인 풀스택 CRUD 흐름을 구현하는 것을 목표로 했습니다.

주요 구현 목표는 다음과 같습니다.

* React/Vite 기반 프론트엔드 구성
* Express 기반 REST API 구현
* 프론트엔드와 백엔드 간 API 통신
* 음식 기록 CRUD 기능 구현
* MVP 기획 문서와 실제 구현 결과 연결
* GitHub 기반 프로젝트 문서화

---

## 주요 기능

### 음식 기록 관리

* 음식 기록 목록 조회
* 음식 기록 추가
* 음식 기록 상세 조회
* 음식 기록 수정
* 음식 기록 삭제

### 식단 피드백

* 전체 음식 기록 수 확인
* 총 칼로리 계산
* 카테고리별 기록 요약
* 기록 데이터를 바탕으로 한 간단한 식단 피드백 제공

---

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Frontend | React, Vite, JavaScript |
| Backend | Node.js, Express |
| API 통신 | Fetch API, Vite Proxy |
| Styling | CSS |
| Data | In-memory Array |
| Lint | ESLint |
| Deployment | Backend Render 배포 완료, Frontend Firebase Hosting 향후 후보 |

---

## 프로젝트 구조

```txt
foodlog/
├── docs/
│   ├── html/
│   ├── pdf/
│   ├── 01_FoodLog_PRD.md
│   ├── 02_FoodLog_Requirements.md
│   ├── 03_FoodLog_UserScenario.md
│   └── 04_FoodLog_Wireframe.md
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/
│   │   └── foods.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── server.js
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
├── .gitignore
└── README.md
```

---

## 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 백엔드 API 서버 실행

```bash
npm run server
```

백엔드 서버는 기본적으로 다음 주소에서 실행됩니다.

```txt
http://localhost:3000
```

### 3. 프론트엔드 개발 서버 실행

다른 터미널을 열고 아래 명령어를 실행합니다.

```bash
npm run dev
```

프론트엔드 개발 서버는 기본적으로 다음 주소에서 실행됩니다.

```txt
http://localhost:5173
```

Vite 개발 서버는 `/foods`, `/feedback` 요청을 `http://localhost:3000` 백엔드 서버로 프록시합니다.

---

## 환경 변수

배포 환경에서는 Render 백엔드 API 주소를 `VITE_API_BASE_URL`로 설정합니다. 예시는 [.env.example](.env.example)에서 확인할 수 있습니다.

```bash
VITE_API_BASE_URL=https://foodlog-api-jz7l.onrender.com
```

로컬에서 Express 서버와 Vite 개발 서버를 함께 실행하는 경우 환경 변수 없이도 Vite proxy를 통해 API를 호출할 수 있습니다. 실제 `.env` 파일은 각 실행 환경에서 필요할 때만 생성합니다.

---

## 백엔드 API 목록

| Method | Endpoint     | 설명          |
| ------ | ------------ | ----------- |
| GET    | `/foods`     | 음식 기록 목록 조회 |
| GET    | `/foods/:id` | 음식 기록 상세 조회 |
| POST   | `/foods`     | 음식 기록 추가    |
| PUT    | `/foods/:id` | 음식 기록 수정    |
| DELETE | `/foods/:id` | 음식 기록 삭제    |
| GET    | `/feedback`  | 식단 피드백 조회   |

---

## 데이터 저장 방식

현재 FoodLog MVP는 별도의 데이터베이스를 사용하지 않고, Express 서버 내부의 인메모리 배열을 사용합니다.

따라서 서버를 재시작하면 추가하거나 수정한 음식 기록 데이터는 초기화될 수 있습니다.

이 구조는 초기 MVP 단계에서 CRUD 흐름과 API 연결 구조를 빠르게 검증하기 위한 방식입니다.

향후 개선 단계에서는 Firestore 또는 별도 데이터베이스를 연동하여 데이터 영속성을 확보할 수 있습니다.

---

## 배포 전략

현재 Express 백엔드 API는 Render Web Service에 배포되어 있습니다. 프론트엔드는 현재 로컬 실행 기준이며, 향후 Firebase Hosting 배포를 고려할 수 있습니다.

Firebase Hosting은 React/Vite 빌드 결과물인 정적 파일 배포에는 적합하지만, Express `server.js` 백엔드 서버를 직접 실행할 수는 없습니다. 프론트엔드 Firebase Hosting 배포와 API base URL 변경은 별도 단계에서 진행합니다.

| 영역 | 배포 상태 |
| --- | --- |
| Backend | Render Web Service 배포 완료 |
| Frontend | 현재 로컬 실행, 향후 Firebase Hosting 배포 가능 |
| Database | 현재 Express 서버의 인메모리 배열 사용 |
| 향후 개선 | Firestore 또는 DB 연동을 통한 데이터 영속성 개선 |

## 배포 주소

### Backend API

Render Web Service를 통해 Express API 서버를 배포했습니다.

* API Base URL: `https://foodlog-api-jz7l.onrender.com`
* 음식 목록 조회: `https://foodlog-api-jz7l.onrender.com/foods`
* 식단 피드백 조회: `https://foodlog-api-jz7l.onrender.com/feedback`

> Render 무료 인스턴스는 일정 시간 요청이 없으면 sleep 상태가 될 수 있으며, 첫 요청 시 응답이 지연될 수 있습니다.

Firebase Hosting 배포 주소와 로컬 개발 주소를 CORS 허용 origin에 추가했습니다.

예상 배포 구조는 다음과 같습니다.

```txt
사용자
↓
로컬 또는 향후 Firebase Hosting에 배포된 React 화면
↓
Render Web Service에 배포된 Express API
↓
음식 기록 데이터 처리
```

현재 프론트엔드 API 호출 경로는 아직 변경하지 않았습니다. Render 배포 URL 기준 연동은 별도 단계에서 진행합니다.

---

## 향후 개선 방향

* Firestore 또는 DB 연동을 통한 데이터 영속성 개선
* 사용자별 음식 기록 관리 기능 추가
* 실제 AI API를 활용한 식단 피드백 고도화
* 칼로리 통계 및 카테고리별 시각화 추가
* Firebase Hosting과 Render Web Service를 활용한 배포 환경 구성
* 입력값 검증 및 에러 메시지 UX 개선
* 모바일 화면 최적화 개선

---

## 프로젝트 요약

FoodLog는 음식 기록 CRUD와 간단한 식단 피드백 기능을 구현한 React + Express 기반 MVP 프로젝트입니다.

현재는 데이터베이스 없이 인메모리 배열을 사용하는 MVP 구조로 구현했으며, 향후 Firestore와 배포 환경을 연동하여 실제 서비스 형태로 확장할 수 있습니다.
