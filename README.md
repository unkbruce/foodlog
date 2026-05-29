# FoodLog

FoodLog는 사용자가 먹은 음식을 간단히 기록하고, 기록된 데이터를 바탕으로 식단 피드백을 확인할 수 있는 **식단 기록 MVP 웹 애플리케이션**입니다.

음식 이름, 카테고리, 칼로리 정보를 등록하고 목록/상세/수정/삭제 기능을 통해 기록을 관리할 수 있습니다. 또한 기록된 음식 데이터를 기준으로 총 기록 수, 총 칼로리, 카테고리별 요약을 확인하고 간단한 식단 피드백을 제공합니다.

현재 버전은 학습 및 포트폴리오 목적의 MVP로, 데이터베이스 없이 Express 서버의 인메모리 배열을 사용하여 CRUD 흐름을 구현했습니다.

---

## 프로젝트 목적

이 프로젝트는 React 프론트엔드와 Express 백엔드 API를 연결하여 기본적인 풀스택 CRUD 흐름을 구현하는 것을 목표로 했습니다.

주요 학습 목표는 다음과 같습니다.

* React/Vite 기반 프론트엔드 구성
* Express 기반 REST API 구현
* 프론트엔드와 백엔드 간 API 통신
* 음식 기록 CRUD 기능 구현
* MVP 기획 문서와 실제 구현 결과 연결
* GitHub 포트폴리오용 프로젝트 문서화

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

| 구분       | 기술               |
| -------- | ---------------- |
| Frontend | React, Vite      |
| Backend  | Node.js, Express |
| Styling  | CSS              |
| API 통신   | Fetch API        |
| Data     | In-memory Array  |
| Lint     | ESLint           |

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
├── src/
│   ├── components/
│   ├── pages/
│   ├── api/
│   ├── App.jsx
│   └── main.jsx
├── server.js
├── package.json
├── vite.config.js
└── README.md
```

> 실제 폴더 구조와 다를 경우 현재 프로젝트 구조에 맞게 일부 경로를 조정할 수 있습니다.

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

Vite 개발 서버는 `/api` 요청을 `http://localhost:3000` 백엔드 서버로 프록시합니다.

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

현재 프로젝트는 로컬 개발 환경에서 실행하는 MVP 단계입니다.

Firebase Hosting은 React/Vite 빌드 결과물인 정적 파일 배포에는 적합하지만, Express `server.js` 백엔드 서버를 직접 실행할 수는 없습니다.

따라서 실제 배포 시에는 다음과 같은 구조를 고려할 수 있습니다.

| 영역       | 배포 방식                                               |
| -------- | --------------------------------------------------- |
| Frontend | Firebase Hosting                                    |
| Backend  | Render Web Service, Cloud Run, Firebase Functions 등 |
| Database | 현재는 인메모리 배열, 향후 Firestore 연동 가능                     |

예상 배포 구조는 다음과 같습니다.

```txt
사용자
↓
Firebase Hosting에 배포된 React 화면
↓
Render Web Service에 배포된 Express API
↓
음식 기록 데이터 처리
```

현재 단계에서는 로컬 MVP를 안정적으로 구현하는 것을 우선으로 하며, 이후 Render Web Service와 Firebase Hosting을 활용한 배포 확장을 고려할 수 있습니다.

---

## 기획 문서

프로젝트 기획과 구현 기준이 되는 문서는 `docs` 폴더에서 확인할 수 있습니다.

* [FoodLog PRD](docs/01_FoodLog_PRD.md)
* [FoodLog 요구사항 정의서](docs/02_FoodLog_Requirements.md)
* [FoodLog 사용자 시나리오](docs/03_FoodLog_UserScenario.md)
* [FoodLog 와이어프레임](docs/04_FoodLog_Wireframe.md)

---

## PDF 기획 문서

PDF 문서는 `docs/pdf` 경로에서 확인할 수 있습니다.

* [PRD PDF](./docs/pdf/01_FoodLog_PRD.pdf)
* [요구사항 정의서 PDF](./docs/pdf/02_FoodLog_Requirements.pdf)
* [사용자 시나리오 PDF](./docs/pdf/03_FoodLog_UserScenario.pdf)
* [와이어프레임 PDF](./docs/pdf/04_FoodLog_Wireframe.pdf)

HTML 문서는 `docs/html` 경로에서 확인할 수 있습니다.

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

현재는 데이터베이스 없이 인메모리 배열을 사용하는 학습용 구조로 구현했으며, 향후 Firestore와 배포 환경을 연동하여 실제 서비스 형태로 확장할 수 있습니다.
