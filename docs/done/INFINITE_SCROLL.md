# MainList 무한 스크롤 구현 계획

## 개요

- **대상 페이지**: MainList (`/list`)
- **기술 스택**: @tanstack/react-query v5 + IntersectionObserver API
- **페이징 방식**: offset 기반 (PokeAPI 표준)
- **페이지 크기**: 20개

---

## 수정/생성 파일 목록

| 파일                                               | 작업 | 설명                             |
| -------------------------------------------------- | ---- | -------------------------------- |
| `apps/web/src/types/pokemon.ts`                    | 수정 | 응답 타입에 pagination 필드 추가 |
| `apps/web/src/queries/usePokemonInfiniteList.ts`   | 신규 | Infinite Query 훅                |
| `apps/web/src/hooks/useIntersectionObserver.ts`    | 신규 | 스크롤 감지 훅 (onChange 콜백)   |
| `apps/web/src/hooks/useScrollRestoration.ts`       | 신규 | 스크롤 위치 복원 훅              |
| `apps/web/src/utils/throttle.ts`                   | 신규 | throttle/debounce 유틸리티       |
| `apps/web/src/pages/MainList/MainList.tsx`         | 수정 | Infinite scroll 적용             |
| `apps/web/src/pages/MainList/MainList.module.scss` | 수정 | 스크롤 레이아웃 + sentinel       |

---

## 단계별 구현 계획

### Phase 1: 타입 수정

**작업 내용:**

`PokemonListResponseType`에 PokeAPI pagination 필드 추가

**수정 파일:**

- `apps/web/src/types/pokemon.ts`

```typescript
export interface PokemonListResponseType {
  count: number; // 전체 포켓몬 수
  next: string | null; // 다음 페이지 URL
  previous: string | null; // 이전 페이지 URL
  results: pokemonType[];
}
```

---

### Phase 2: Infinite Query 훅 생성

**작업 내용:**

`useSuspenseInfiniteQuery`를 사용하는 새 훅 생성

**신규 파일:**

- `apps/web/src/queries/usePokemonInfiniteList.ts`

```typescript
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getPokemonList } from "api/pokemon";

const PAGE_SIZE = 20;

export const usePokemonInfiniteList = () => {
  return useSuspenseInfiniteQuery({
    queryKey: ["pokemon-infinite-list"],
    queryFn: ({ pageParam = 0 }) =>
      getPokemonList({ limit: PAGE_SIZE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined;
      return allPages.length * PAGE_SIZE;
    },
  });
};
```

**주요 설정:**

| 옵션               | 값          | 설명                                    |
| ------------------ | ----------- | --------------------------------------- |
| `initialPageParam` | 0           | 첫 페이지 offset                        |
| `getNextPageParam` | offset 계산 | `next`가 null이면 undefined 반환 (종료) |

---

### Phase 3: IntersectionObserver 훅 생성

**작업 내용:**

스크롤 감지용 재사용 가능한 커스텀 훅 생성 (onChange 콜백 패턴)

**신규 파일:**

- `apps/web/src/hooks/useIntersectionObserver.ts`

```typescript
import { useEffect, useRef } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
  onChange?: () => void;
}

export function useIntersectionObserver({
  threshold = 0.1, // ref가 10% 보이면 트리거
  rootMargin = "100px", // ref 도달하기 100px 전에 트리거
  enabled = true,
  onChange,
}: UseIntersectionObserverOptions = {}) {
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    if (!triggerRef.current) return;

    const element = triggerRef.current; // cleanup에서 사용할 참조 저장
    const observer = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          onChange?.();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => observer.disconnect(); // 모든 요소에 대해 observe 종료
  }, [enabled, threshold, rootMargin, onChange]);

  return { ref: triggerRef };
}
```

**옵션 설명:**

| 옵션         | 기본값  | 설명                                 |
| ------------ | ------- | ------------------------------------ |
| `threshold`  | 0.1     | 10% 보이면 트리거                    |
| `rootMargin` | "100px" | 100px 전에 미리 감지                 |
| `enabled`    | true    | 비활성화 시 감지 중단                |
| `onChange`   | -       | 교차 시 호출할 콜백 (상태 대신 사용) |

**설계 선택: onChange 콜백 vs isIntersecting 상태**

| 방식             | 장점                         | 단점                         |
| ---------------- | ---------------------------- | ---------------------------- |
| `onChange` 콜백  | 리렌더링 없음, 무한루프 방지 | 교차 상태 UI 표시 불가       |
| `isIntersecting` | 상태 기반 UI 가능            | 리렌더링 발생, 무한루프 위험 |

무한스크롤에는 **onChange 콜백 패턴**이 적합.

---

### Phase 4: throttle 유틸리티 생성

**작업 내용:**

스크롤 이벤트 최적화를 위한 throttle/debounce 유틸리티

**신규 파일:**

- `apps/web/src/utils/throttle.ts`

```typescript
export function throttle<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastRun = 0;

  // delay 마다 1번씩 실행 // leading only
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastRun >= delay) {
      lastRun = now;
      fn(...args);
    }
  };
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}
```

**throttle vs debounce:**

| 함수       | 동작                           | 사용 예                 |
| ---------- | ------------------------------ | ----------------------- |
| `throttle` | delay마다 최대 1번 실행        | 스크롤 위치 저장        |
| `debounce` | 호출 멈춘 후 delay 뒤 1번 실행 | 검색어 입력 후 API 호출 |

---

### Phase 5: 스크롤 복원 훅 생성

**작업 내용:**

상세 페이지에서 돌아올 때 스크롤 위치 복원

**신규 파일:**

- `apps/web/src/hooks/useScrollRestoration.ts`

```typescript
import { useEffect } from "react";
import { throttle } from "utils/throttle";

export function useScrollRestoration(key: string) {
  useEffect(() => {
    // 복원
    const savedY = sessionStorage.getItem(key);
    if (savedY) {
      window.scrollTo(0, parseInt(savedY, 10));
    }

    // 저장 (throttle로 성능 최적화)
    const handleScroll = throttle(() => {
      sessionStorage.setItem(key, window.scrollY.toString());
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [key]);
}
```

**동작:**

1. 컴포넌트 마운트 시 `sessionStorage`에서 저장된 위치 복원
2. 스크롤 시 100ms throttle로 위치 저장
3. 상세 페이지 → 뒤로가기 → 이전 스크롤 위치로 자동 이동

---

### Phase 6: MainList 컴포넌트 수정

**작업 내용:**

1. `usePokemonList` → `usePokemonInfiniteList` 변경
2. `useIntersectionObserver` 연동 (onChange 콜백)
3. `useScrollRestoration` 추가
4. sentinel div 추가

**수정 파일:**

- `apps/web/src/pages/MainList/MainList.tsx`

```typescript
import classNames from "classnames/bind";
import { usePokemonInfiniteList } from "queries/usePokemonInfiniteList";
import { useIntersectionObserver } from "hooks/useIntersectionObserver";
import { useScrollRestoration } from "hooks/useScrollRestoration";
import { Loading } from "@mydav/design-system";
import { withAsyncBoundary } from "utils/HOC";

import styles from "./MainList.module.scss";
import PokemonList from "./ui/PokemonList";

const cx = classNames.bind(styles);

function MainList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePokemonInfiniteList();

  const allPokemon = data?.pages.flatMap((page) => page.results) ?? [];

  const { ref } = useIntersectionObserver({
    onChange: () => fetchNextPage(),
    enabled: hasNextPage && isFetchingNextPage === false,
    threshold: 0.5,
    rootMargin: "100px",
  });

  useScrollRestoration("mainListScrollY");

  return (
    <div className={cx("main-list-layout")}>
      <PokemonList pokemonList={allPokemon} />
      <div ref={ref} className={cx("sentinel")}>
        {isFetchingNextPage && <Loading size="small" />}
      </div>
    </div>
  );
}

export default withAsyncBoundary(MainList);
```

---

### Phase 7: 스타일 수정

**작업 내용:**

1. 스크롤 가능한 레이아웃으로 변경
2. sentinel 스타일 추가

**수정 파일:**

- `apps/web/src/pages/MainList/MainList.module.scss`

```scss
@use "styles/color.module" as color;

.main-list-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 8px 4px 0;
  background-color: map-get(color.$background, background-primary);
  overflow-y: auto;
}

.sentinel {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
}
```

---

## 데이터 흐름

```
사용자 스크롤
     ↓
IntersectionObserver가 sentinel 감지
     ↓
isIntersecting = true → onChange() 콜백 호출
     ↓
fetchNextPage()
     ↓
useSuspenseInfiniteQuery가 다음 offset으로 fetch
     ↓
data.pages에 새 페이지 추가
     ↓
allPokemon = pages.flatMap() 재계산
     ↓
PokemonList 리렌더 (추가 아이템 표시)
     ↓
sentinel이 아래로 이동, 반복
```

---

## 주요 동작

| 항목        | 설명                                       |
| ----------- | ------------------------------------------ |
| 초기 로딩   | 기존 `withAsyncBoundary` 유지 (Suspense)   |
| 추가 로딩   | `isFetchingNextPage`로 인라인 Loading 표시 |
| 종료 조건   | `hasNextPage === false`면 fetch 중단       |
| 미리 로딩   | `rootMargin: "100px"`으로 100px 전에 시작  |
| 중복 방지   | `enabled` 옵션으로 동시 요청 방지          |
| 스크롤 복원 | `sessionStorage`에 위치 저장/복원          |

---

## API 참고

### usePokemonInfiniteList 반환값

```typescript
{
  data: {
    pages: PokemonListResponseType[];  // 모든 페이지 배열
    pageParams: number[];              // 각 페이지의 offset
  };
  fetchNextPage: () => void;           // 다음 페이지 fetch
  hasNextPage: boolean;                // 다음 페이지 존재 여부
  isFetchingNextPage: boolean;         // 다음 페이지 로딩 중
}
```

### PokeAPI 응답 예시

```json
{
  "count": 1302,
  "next": "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
  "previous": null,
  "results": [
    { "name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon/1/" },
    { "name": "ivysaur", "url": "https://pokeapi.co/api/v2/pokemon/2/" }
  ]
}
```

---

## Challenge: 무한 로딩 버그

### 문제

`isIntersecting` 상태를 사용할 경우, 데이터 로드 후 `fetchNextPage`가 무한 반복 호출됨.

```
1. 스크롤 → sentinel이 viewport에 들어옴
2. isIntersecting = true
3. fetchNextPage() 호출
4. isFetchingNextPage: false → true → false (로드 완료)
5. useEffect 의존성 변경으로 재실행
6. isIntersecting이 여전히 true → fetchNextPage() 다시 호출
7. 2~6 반복 (무한 루프)
```

### 원인

- `isFetchingNextPage`가 `false`로 돌아올 때 useEffect가 재실행됨
- `isIntersecting`이 여전히 `true`이므로 조건을 만족하여 `fetchNextPage` 재호출

### 해결책: onChange 콜백 패턴

상태 대신 콜백을 사용하여 IntersectionObserver 내부에서 직접 함수 호출.

```typescript
// ❌ 문제 있는 방식 (상태 기반)
const { ref, isIntersecting } = useIntersectionObserver();
useEffect(() => {
  if (isIntersecting) fetchNextPage();
}, [isIntersecting, ...]);

// ✅ 해결된 방식 (콜백 기반)
const { ref } = useIntersectionObserver({
  onChange: () => fetchNextPage(),
  enabled: hasNextPage && !isFetchingNextPage,
});
```

### 핵심 포인트

| 항목 | 설명                                           |
| ---- | ---------------------------------------------- |
| 문제 | 상태 기반 useEffect가 의존성 변경 시 반복 실행 |
| 해결 | 콜백 패턴으로 Observer 내부에서 직접 호출      |
| 장점 | 리렌더링 없음, useEffect 의존성 문제 해결      |
