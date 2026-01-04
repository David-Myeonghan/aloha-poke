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
| `apps/web/src/hooks/useIntersectionObserver.ts`    | 신규 | 스크롤 감지 훅                   |
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

스크롤 감지용 재사용 가능한 커스텀 훅 생성

**신규 파일:**

- `apps/web/src/hooks/useIntersectionObserver.ts`

```typescript
import { useEffect, useRef, useState, RefObject } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useIntersectionObserver<T extends HTMLElement>({
  threshold = 0.1,
  rootMargin = "100px",
  enabled = true,
}: UseIntersectionObserverOptions = {}): {
  ref: RefObject<T>;
  isIntersecting: boolean;
} {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold, rootMargin },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, enabled]);

  return { ref, isIntersecting };
}
```

**옵션 설명:**

| 옵션         | 기본값  | 설명                  |
| ------------ | ------- | --------------------- |
| `threshold`  | 0.1     | 10% 보이면 트리거     |
| `rootMargin` | "100px" | 100px 전에 미리 감지  |
| `enabled`    | true    | 비활성화 시 감지 중단 |

---

### Phase 4: MainList 컴포넌트 수정

**작업 내용:**

1. `usePokemonList` → `usePokemonInfiniteList` 변경
2. `useIntersectionObserver` 연동
3. sentinel div 추가

**수정 파일:**

- `apps/web/src/pages/MainList/MainList.tsx`

```typescript
import { useEffect } from "react";
import classNames from "classnames/bind";
import { usePokemonInfiniteList } from "queries/usePokemonInfiniteList";
import { useIntersectionObserver } from "hooks/useIntersectionObserver";
import { Loading } from "@mydav/design-system";
import { ErrorPage } from "pages/ErrorPage";
import { withAsyncBoundary } from "utils/HOC";

import styles from "./MainList.module.scss";
import PokemonList from "./ui/PokemonList";

const cx = classNames.bind(styles);

function MainList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePokemonInfiniteList();

  const allPokemon = data?.pages.flatMap((page) => page.results) ?? [];

  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    enabled: hasNextPage && !isFetchingNextPage,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

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

### Phase 5: 스타일 수정

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
isIntersecting = true
     ↓
useEffect → fetchNextPage()
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

| 항목      | 설명                                       |
| --------- | ------------------------------------------ |
| 초기 로딩 | 기존 `withAsyncBoundary` 유지 (Suspense)   |
| 추가 로딩 | `isFetchingNextPage`로 인라인 Loading 표시 |
| 종료 조건 | `hasNextPage === false`면 fetch 중단       |
| 미리 로딩 | `rootMargin: "100px"`으로 100px 전에 시작  |
| 중복 방지 | `isFetchingNextPage` 체크로 동시 요청 방지 |

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
