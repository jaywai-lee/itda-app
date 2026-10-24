<p align="center">
  <img src="./assets/images/icon.png" alt="잇다 (Itda) 로고" width="400"/>
</p>

<p align="center">
  <b>일정과 가계부를 하나로 잇는 해외여행 예산 및 동선 관리 앱</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.86-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-SDK_58-000000?style=flat-square&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Database-3FCF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-NativeWind_v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" alt="NativeWind" />
</p>

---

## 📱 프로젝트 소개

**잇다(Itda)**는 해외여행 중 예산 관리와 일정 관리를 유기적으로 연결한 모바일 가계부 애플리케이션입니다. 

기존 여행 앱들이 일정표(동선)와 가계부(지출)를 완전히 분리하여 관리하던 한계를 극복하고, 일정상의 각 방문 장소에서 발생한 지출이 가계부 및 여행 총예산에 실시간으로 반영되는 **양방향 연동 기능**을 핵심 가치로 제공합니다.

---

## 📌 브랜드 아이덴티티 & 콘셉트

* **콘셉트**: **지도 핀**(일정) + **동전**(지출) + 둘을 잇는 **곡선**  
  핀에서 흘러내린 줄기가 동전까지 이어져, 일정과 가계부가 하나로 결합되는 서비스의 정체성을 표현합니다.
* **컬러 팔레트**:
  | 용도 | 컬러 값 | 디자인 토큰 |
  | --- | --- | --- |
  | 메인 블루 (Primary) | `#2563EB` | `COLORS.primary.DEFAULT` |
  | 메인 블루 그라데이션 | `#3B82F6` → `#1D4ED8` | - |
  | 포인트 앰버 (동전 Accent) | `#FCD34D` → `#F59E0B` | `COLORS.budget.warning` |
  | 텍스트 (Ink) | `#0F172A` | `COLORS.ink.DEFAULT` |
  | 배경 (Canvas) | `#F2F4F8` | `COLORS.canvas` |

---

## ✨ 핵심 차별점 & 주요 기능

### 1. 🔗 양방향 실시간 일정-지출 연동 (Killer Feature)
* **일정 기반 바로 지출 추가**: 일정 탭의 특정 방문 장소 카드에서 '지출 추가' 선택 시 `itinerary_id`가 자동으로 매핑되어 바로 지출 작성 진입.
* **실시간 예산 반영**: 일정에서 발생한 지출이 즉시 해당 여행의 가계부 사용액 및 남은 예산 잔액에 자동 합산 반영.
* **장소 배지 & 소비 금액 표기**: 가계부 내역 항목에 연동된 장소 배지가 표기되며, 일정 카드 내에서도 해당 장소에서 지출한 금액 합산 출력.

### 2. 💰 여행 가계부 (Expense Management)
* **여행 생성 및 예산 관리**: 여행지, 기간, 기준 통화, 총예산을 설정하고 실시간 프로그레스 바를 통해 예산 초과 여부 확인.
* **실시간 환율 변환**: 현지 통화 입력 시 한국 원화(KRW) 환산 금액 자동 계산 (`fetchExchangeRate`).
* **카테고리별 통계**: 식비, 교통, 숙박, 쇼핑 등 카테고리별 지출 비중 분석 및 카테고리 커스터마이징(색상/아이콘).

### 3. 🗺️ 일정 & 지도 (Itinerary & Map)
* **N일차별 동선 구분**: 여행 일자별(Day 1, Day 2...)로 동선을 분류하여 일자별 방문지 관리.
* **Google Maps 연동 & 순서 마커**: 장소 검색 및 좌표 자동 등록, 지도상에 방문 순서(`Order Index + 1`)가 명시된 커스텀 마커 핀 제공.
* **드래그 앤 드롭 순서 변경**: `react-native-draggable-flatlist` 및 Reanimated 기반의 바텀시트에서 드래그로 일정 순서 변경 시 DB `order_index`에 실시간 업데이트.

### 4. ⚙️ 설정 & 마이페이지
* **지난 여행 히스토리**: 지나간 여행 기록 및 총 지출 통계 확인.
* **사용자 설정**: 기본 통화 지정, 원화 환산 표시 여부 토글, 개인정보 처리방침 안내.

---

## 🛠 기술 스택 (Tech Stack)

### Frontend
* **Core**: React Native, Expo SDK 58 (New Architecture enabled), TypeScript
* **Routing**: Expo Router (File-based Routing)
* **Styling**: NativeWind v4 (Tailwind CSS v3.4), Lucide React Native Icons
* **State Management**: TanStack Query (React Query v5)

### Backend & Database
* **Database & Auth**: Supabase (PostgreSQL, Supabase Auth, Row Level Security)
* **API**: Google Places API (장소 검색 및 자동완성), Exchange Rate API (실시간 환율)

### Animation & Gesture
* **UI Effects**: React Native Reanimated v4, React Native Gesture Handler, `react-native-draggable-flatlist`

---

## 🗄 데이터베이스 스키마 (Database Schema)

```sql
-- 1. 여행 정보 (trips)
CREATE TABLE public.trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  currency text NOT NULL,
  total_budget numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. 일정 항목 (itineraries)
CREATE TABLE public.itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  title text,
  place_name text,
  lat double precision,
  lng double precision,
  visit_date date NOT NULL,
  visit_time time,
  memo text,
  order_index integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. 지출 카테고리 (categories)
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES public.trips(id) ON DELETE CASCADE, -- null일 경우 시스템 기본 카테고리
  name text NOT NULL,
  icon text,
  color text
);

-- 4. 지출 내역 (expenses)
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  itinerary_id uuid REFERENCES public.itineraries(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  amount_krw numeric,
  currency text NOT NULL,
  memo text,
  photo_url text,
  spent_at date NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
```

---

## 📂 프로젝트 구조 (Project Structure)

```text
itda-app/
├── app/                        # Expo Router 파일 기반 라우팅
│   ├── (auth)/                 # 로그인 및 회원가입 스크린
│   ├── (tabs)/                 # 메인 탭 (가계부, 일정, 마이페이지)
│   ├── settings/               # 카테고리 설정, 약관 등 설정 화면
│   └── _layout.tsx             # Root Layout & Global Context Provider
├── assets/                     # 브랜드 로고 및 앱 아이콘, 스플래시 이미지
├── src/
│   ├── components/             # UI 및 도메인 컴포넌트
│   │   ├── category/           # 카테고리 설정/아이콘 컴포넌트
│   │   ├── common/             # Modal, TabHeader 공통 컴포넌트
│   │   ├── expense/            # 지출 등록/수정 모달 및 리스트
│   │   ├── itinerary/          # 일정, 타임라인, 지도 마커 컴포넌트
│   │   ├── trip/               # 여행 카드 및 요약 대시보드
│   │   └── ui/                 # Typography, Card, Button, Chip 디자인 시스템
│   ├── constants/              # COLORS, SHADOWS, COUNTRIES 등
│   ├── context/                # AuthContext 전역 인증 상태
│   ├── hooks/                  # TanStack Query 연동 Custom Hooks (Container/Presenter)
│   ├── services/               # Supabase Client 초기화
│   ├── types/                  # Supabase 데이터베이스 자동 생성 타입 및 인터페이스
│   └── utils/                  # 날짜 계산, 환율 계산 등 공통 유틸리티
├── tailwind.config.js          # NativeWind 테마 설정
└── app.json                    # Expo 모듈 및 네이티브 빌드 설정
```

---

## 🚀 개발 환경 세팅 및 실행 (Getting Started)

### 1. 레포지토리 클론 및 패키지 설치
```bash
git clone https://github.com/your-repo/itda-app.git
cd itda-app
npm install
```

### 2. 환경 변수 설정 (`.env`)
프로젝트 루트 디렉터리에 `.env` 파일을 생성하고 아래 환경 변수를 입력합니다.

```env
EXPO_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=YOUR_GOOGLE_MAPS_PLACES_API_KEY
```

### 3. Supabase TypeScript 타입 생성 (필요 시)
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

### 4. 개발 서버 실행
```bash
# 번들러 캐시 비우고 실행
npx expo start -c
