## 🚀 [앱 실행하기](https://lgw7126.github.io/antigravity-Pet119-app/)

# 🏥 Pet119 — 내 주변 동물병원 즉시 탐색

> **🔗 실행 링크**: [https://lgw7126.github.io/antigravity-Pet119-app](https://lgw7126.github.io/antigravity-Pet119-app)

---

## 📋 기획 개요

반려동물 응급 상황 시 현재 위치를 기반으로 가장 가까운 동물병원을 즉시 찾아주는 모바일 최적화 웹앱. 카카오 로컬 API 연동으로 실시간 주변 병원을 탐색하며, API 키 없이도 시뮬레이션 모드로 바로 체험 가능.

---

## ✨ 주요 기능

- **레이더 스캐너 UI** — 주변 병원을 시각적으로 탐색하는 애니메이션 레이더
- **GPS 위치 기반 탐색** — 브라우저 Geolocation으로 현재 위치 자동 파악
- **카카오 로컬 API 연동** — 실제 주변 동물병원 검색
- **시뮬레이션 모드** — API 키 없이도 UI 체험 가능
- **병원 카드 목록** — 병원명, 거리, 전화번호 표시
- **설정 모달** — API 키 및 위치 프리셋 설정

---

## 🛠️ 기술 스택

- **Framework**: React (Vite)
- **Language**: JavaScript
- **API**: 카카오 로컬 API

---

## ⚙️ 설정 방법

1. [카카오 개발자 콘솔](https://developers.kakao.com)에서 REST API 키 발급
2. 앱 상단 ⚙️ 설정 버튼 → API 키 입력
3. 또는 `.env` 파일에 `VITE_KAKAO_REST_API_KEY=발급받은키` 입력

API 키 없이도 **시뮬레이션 모드**로 바로 사용 가능합니다.

## 🚀 로컬 실행

```bash
npm install
npm run dev
```
