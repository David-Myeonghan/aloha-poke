# 상태 관리 설계서

> 이 문서는 Aloha Poke 앱의 상태 관리 구조와 데이터 흐름을 정의합니다.

---

## 1. 상태 관리 개요

### 1.1 상태 분류

| 분류          | 도구        | 용도             | 범위     |
| ------------- | ----------- | ---------------- | -------- |
| **서버 상태** | React Query | API 데이터 캐싱  | 전역     |
| **로컬 상태** | useState    | UI 상태, 폼 입력 | 컴포넌트 |
| **영구 저장** | IndexedDB   | 최근 본 포켓몬   | 브라우저 |

### 1.2 상태 흐름 다이어그램

```
┌─────────────────────────────────────────────────────────────────┐
│                         React App                                │
│                                                                  │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│   │ React Query  │      │   useState   │      │  IndexedDB   │  │
│   │   (캐시)     │      │  (로컬 상태)  │      │ (영구 저장)   │  │
│   └──────┬───────┘      └──────────────┘      └──────┬───────┘  │
│          │                                           │          │
│          │ fetch                                     │ read/    │
│          ↓                                           ↓ write    │
│   ┌──────────────┐                           ┌──────────────┐   │
│   │   PokéAPI    │                           │   Browser    │   │
│   │  (외부 서버)  │                           │  IndexedDB   │   │
│   └──────────────┘                           └──────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. React Query (서버 상태)

### 2.1 설정

#### QueryClient 설정

```typescript
// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5분간 fresh 상태 유지
      gcTime: 1000 * 60 * 30,      // 30분간 캐시 유지 (구 cacheTime)
      retry: 2,                     // 실패 시 2번 재시도
      refetchOnWindowFocus: false,  // 창 포커스 시 재요청 안함
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* ... */}
    </QueryClientProvider>
  );
}
```

### 2.2 쿼리 키 구조

| 쿼리        | 키 구조                        | 예시                              |
| ----------- | ------------------------------ | --------------------------------- |
| 포켓몬 목록 | `["pokemon-list", params]`     | `["pokemon-list", { limit: 20 }]` |
| 포켓몬 상세 | `["pokemon-detail", idOrName]` | `["pokemon-detail", "bulbasaur"]` |

### 2.3 커스텀 훅

#### usePokemonList

```typescript
// src/hooks/usePokemonList.ts
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPokemonList } from "remote/pokemon";

interface PokemonListParam {
  limit?: number;
  offset?: number;
}

export const usePokemonList = (params: PokemonListParam) => {
  return useSuspenseQuery({
    queryKey: usePokemonList.getKey(params),
    queryFn: () => getPokemonList(params),
  });
};

// 쿼리 키 생성 함수 (정적 메서드)
usePokemonList.getKey = (params: PokemonListParam) => ["pokemon-list", params];
```

#### usePokemonDetail

```typescript
// src/hooks/usePokemonDetail.ts
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPokemonDetail } from "remote/pokemon";

export const usePokemonDetail = (idOrName: string) => {
  return useSuspenseQuery({
    queryKey: usePokemonDetail.getKey(idOrName),
    queryFn: () => getPokemonDetail(idOrName),
  });
};

usePokemonDetail.getKey = (idOrName: string) => ["pokemon-detail", idOrName];
```

### 2.4 데이터 흐름

```
컴포넌트 렌더링
      │
      ↓
usePokemonList({ limit: 20 }) 호출
      │
      ↓
┌─────────────────────────────────────┐
│ React Query: 캐시 확인              │
│                                     │
│ 캐시 있음 (fresh)?                  │
│   → YES: 캐시 데이터 반환           │
│   → NO: queryFn 실행 (API 호출)     │
└─────────────────────────────────────┘
      │
      ↓
Suspense가 로딩 상태 처리
      │
      ↓
데이터 수신 → 컴포넌트 렌더링
```

### 2.5 캐시 무효화

```typescript
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

// 특정 쿼리 무효화
queryClient.invalidateQueries({ queryKey: ["pokemon-list"] });

// 모든 포켓몬 상세 쿼리 무효화
queryClient.invalidateQueries({ queryKey: ["pokemon-detail"] });
```

---

## 3. 로컬 상태 (useState)

### 3.1 컴포넌트별 로컬 상태

#### RecentView

```typescript
// 최근 본 포켓몬 목록
const [recentPokemonList, setRecentPokemonList] = useState<
  RecentViewedPokemon[]
>([]);
```

| 상태                | 타입                    | 초기값 | 용도                      |
| ------------------- | ----------------------- | ------ | ------------------------- |
| `recentPokemonList` | `RecentViewedPokemon[]` | `[]`   | IndexedDB에서 조회한 목록 |

#### useIndexChange (커스텀 훅)

```typescript
// 회전 인덱스
const [index, setIndex] = useState(0);
```

| 상태    | 타입     | 초기값 | 용도                      |
| ------- | -------- | ------ | ------------------------- |
| `index` | `number` | `0`    | 현재 표시할 포켓몬 인덱스 |

### 3.2 커스텀 훅: useIndexChange

```typescript
// src/hooks/useIndexChange.ts
import { useState, useEffect } from "react";

export default function useIndexChange(maxLength: number) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // 목록이 비어있으면 타이머 설정 안함
    if (maxLength === 0) return;

    const indexInterval = setInterval(() => {
      // 순환 (0 → 1 → 2 → ... → maxLength-1 → 0)
      setIndex((prev) => (prev + 1) % maxLength);
    }, 2000); // 2초마다

    return () => {
      clearInterval(indexInterval);
    };
  }, [maxLength]);

  return { index };
}
```

#### 동작 흐름

```
maxLength = 3 (최근 본 포켓몬 3개)

시간:  0s    2s    4s    6s    8s   ...
index:  0     1     2     0     1   ...
        ↑     ↑     ↑     ↑     ↑
     bulb  ivy   venu  bulb  ivy  ...
```

### 3.3 커스텀 훅: useRecentPokemonList

```typescript
// src/hooks/useRecentPokemonList.ts
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAllRecentPokemon } from "store/recentPokemon";
import { RECENT_VIEW } from "constants/config";

export function useRecentPokemonList() {
  const { pathname } = useLocation();
  const [recentPokemonList, setRecentPokemonList] = useState<
    RecentViewedPokemon[]
  >([]);

  useEffect(() => {
    // 페이지 이동할 때마다 최근 본 목록 재조회
    getAllRecentPokemon(RECENT_VIEW).then((res) => {
      setRecentPokemonList(res);
    });
  }, [pathname]);

  return { recentPokemonList };
}
```

#### 데이터 흐름

```
pathname 변경 (페이지 이동)
          │
          ↓
useEffect 트리거
          │
          ↓
getAllRecentPokemon() → IndexedDB 조회
          │
          ↓
setRecentPokemonList() → 상태 업데이트
          │
          ↓
RecentView 리렌더링
```

---

## 4. IndexedDB (영구 저장)

### 4.1 데이터베이스 구조

```
Database: "Recent View"
├── Version: 1
└── Object Store: "Recent View"
    ├── keyPath: "name"
    ├── autoIncrement: true
    └── Records:
        ├── { name: "bulbasaur", url: "/detail?name=bulbasaur" }
        ├── { name: "pikachu", url: "/detail?name=pikachu" }
        └── { name: "charizard", url: "/detail?name=charizard" }
```

### 4.2 데이터 타입

```typescript
// src/types/pokemon.ts
export interface RecentViewedPokemon {
  name: string; // 포켓몬 이름 (키)
  url: string; // 상세 페이지 경로
}
```

### 4.3 IndexedDB Singleton 패턴

```typescript
// src/utils/IndexedDB/IndexedDBSingleton.ts

class IndexedDBSingleton {
  // 싱글톤 인스턴스 (프라이빗 정적 필드)
  static #instance: Promise<IDBDatabase> | null = null;

  /**
   * DB 열기/생성
   */
  public static openDB(
    name: string,
    version: number,
    upgradeCallback?: (db: IDBDatabase) => void,
  ): Promise<IDBDatabase> {
    if (this.#instance) return this.#instance;

    this.#instance = new Promise((resolve, reject) => {
      const request = indexedDB.open(name, version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (upgradeCallback) {
          upgradeCallback(db);
        }
      };
    });

    return this.#instance;
  }

  /**
   * 트랜잭션 획득
   */
  public static async getTransaction(
    storeName: string,
    mode: IDBTransactionMode = "readonly",
  ): Promise<IDBObjectStore> {
    if (!this.#instance) {
      throw new Error("Database not initialized");
    }

    const db = await this.#instance;
    const transaction = db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }
}

export default IndexedDBSingleton;
```

### 4.4 스토어 함수

```typescript
// src/store/recentPokemon.ts
import IndexedDBSingleton from "utils/IndexedDB/IndexedDBSingleton";
import { RecentViewedPokemon } from "types/pokemon";

/**
 * 모든 최근 본 포켓몬 조회
 */
export const getAllRecentPokemon = async (
  storeName: string,
): Promise<RecentViewedPokemon[]> => {
  const store = await IndexedDBSingleton.getTransaction(storeName, "readonly");

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * 최근 본 포켓몬 추가/업데이트
 */
export const addRecentPokemon = async (
  storeName: string,
  data: RecentViewedPokemon,
): Promise<IDBValidKey> => {
  const store = await IndexedDBSingleton.getTransaction(storeName, "readwrite");

  return new Promise((resolve, reject) => {
    // put: 존재하면 업데이트, 없으면 추가
    const request = store.put(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
```

### 4.5 초기화

```typescript
// src/App.tsx
import IndexedDBSingleton from "utils/IndexedDB/IndexedDBSingleton";
import { RECENT_VIEW } from "constants/config";

// DB 스키마 생성 콜백
const createDB = (db: IDBDatabase) => {
  if (!db.objectStoreNames.contains(RECENT_VIEW)) {
    db.createObjectStore(RECENT_VIEW, {
      keyPath: "name",
      autoIncrement: true,
    });
  }
};

// 앱 시작 시 DB 초기화
IndexedDBSingleton.openDB(RECENT_VIEW, 1, createDB).catch((err) =>
  console.error("IndexedDB 초기화 실패:", err),
);
```

### 4.6 데이터 흐름

#### 저장 흐름 (상세 페이지 접근 시)

```
사용자가 /detail?name=bulbasaur 접속
              │
              ↓
withAddRecentPokemon HOC 실행
              │
              ↓
useEffect → addRecentPokemon() 호출
              │
              ↓
IndexedDBSingleton.getTransaction("readwrite")
              │
              ↓
store.put({ name: "bulbasaur", url: "/detail?name=bulbasaur" })
              │
              ↓
IndexedDB에 저장 완료
```

#### 조회 흐름 (페이지 이동 시)

```
페이지 이동 (pathname 변경)
              │
              ↓
useRecentPokemonList 훅의 useEffect 실행
              │
              ↓
getAllRecentPokemon() 호출
              │
              ↓
IndexedDBSingleton.getTransaction("readonly")
              │
              ↓
store.getAll()
              │
              ↓
결과: [{ name: "bulbasaur", url: "..." }, { name: "pikachu", url: "..." }]
              │
              ↓
setRecentPokemonList() → UI 업데이트
```

---

## 5. 상태 통합 다이어그램

### 5.1 전체 데이터 흐름

```
┌─────────────────────────────────────────────────────────────────────┐
│                              App                                     │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    QueryClientProvider                       │    │
│  │                                                              │    │
│  │  ┌────────────────────────────────────────────────────────┐ │    │
│  │  │                      Router                             │ │    │
│  │  │                                                         │ │    │
│  │  │  ┌─────────────────────────────────────────────────┐   │ │    │
│  │  │  │                    Header                        │   │ │    │
│  │  │  │                                                  │   │ │    │
│  │  │  │  RecentView                                      │   │ │    │
│  │  │  │  ├── useRecentPokemonList() ←── IndexedDB       │   │ │    │
│  │  │  │  └── useIndexChange() ←── useState              │   │ │    │
│  │  │  │                                                  │   │ │    │
│  │  │  └──────────────────────────────────────────────────┘   │ │    │
│  │  │                         │                               │ │    │
│  │  │                      <Outlet>                           │ │    │
│  │  │                         │                               │ │    │
│  │  │          ┌──────────────┴──────────────┐               │ │    │
│  │  │          ↓                             ↓               │ │    │
│  │  │  ┌──────────────┐            ┌──────────────┐          │ │    │
│  │  │  │  MainList    │            │  DetailPage  │          │ │    │
│  │  │  │              │            │              │          │ │    │
│  │  │  │ usePokemon   │            │ usePokemon   │          │ │    │
│  │  │  │   List()     │            │   Detail()   │          │ │    │
│  │  │  │      ↓       │            │      ↓       │          │ │    │
│  │  │  │ React Query  │            │ React Query  │          │ │    │
│  │  │  │      ↓       │            │      ↓       │          │ │    │
│  │  │  │  PokéAPI     │            │  PokéAPI     │          │ │    │
│  │  │  │              │            │              │          │ │    │
│  │  │  │              │            │ withAddRecent│          │ │    │
│  │  │  │              │            │   Pokemon()  │          │ │    │
│  │  │  │              │            │      ↓       │          │ │    │
│  │  │  │              │            │  IndexedDB   │          │ │    │
│  │  │  └──────────────┘            └──────────────┘          │ │    │
│  │  │                                                         │ │    │
│  │  └─────────────────────────────────────────────────────────┘ │    │
│  │                                                              │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.2 시퀀스 다이어그램: 상세 페이지 접근

```
User        DetailPage     React Query     PokéAPI      IndexedDB
 │              │               │             │             │
 │──클릭────────→│               │             │             │
 │              │               │             │             │
 │              │──queryFn()────→│             │             │
 │              │               │──GET /pokemon/1──→│       │
 │              │               │             │             │
 │              │               │←───JSON─────│             │
 │              │←───data───────│             │             │
 │              │               │             │             │
 │              │──addRecentPokemon()──────────────────────→│
 │              │               │             │             │
 │              │←──────────────────────────────────success─│
 │              │               │             │             │
 │←───렌더링────│               │             │             │
```

---

## 6. 에러 처리

### 6.1 React Query 에러

```typescript
// useSuspenseQuery 사용 시 에러는 ErrorBoundary로 전파
// withAsyncBoundary HOC에서 처리

export default withAsyncBoundary(MainList, {
  pendingFallback: <Loading />,
  rejectedFallback: <ErrorPage />,  // 에러 시 표시
});
```

### 6.2 IndexedDB 에러

```typescript
// 초기화 에러
IndexedDBSingleton.openDB(RECENT_VIEW, 1, createDB).catch((err) => {
  console.error("IndexedDB 초기화 실패:", err);
  // 최근 본 기능이 동작하지 않지만 앱은 계속 동작
});

// 저장/조회 에러
try {
  await addRecentPokemon(storeName, data);
} catch (error) {
  console.error("최근 본 포켓몬 저장 실패:", error);
  // 무시하고 계속 진행 (치명적이지 않음)
}
```

---

## 7. 상수 정의

```typescript
// src/constants/config.ts

// PokéAPI 기본 URL
export const POKE_BASE_URL = import.meta.env.VITE_POKE_API_URL;
// 값: "https://pokeapi.co/api/v2/"

// IndexedDB 스토어 이름
export const RECENT_VIEW = "Recent View";

// 페이지당 포켓몬 수
export const POKEMON_PER_PAGE = 20;

// 최근 본 포켓몬 회전 간격 (ms)
export const RECENT_ROTATE_INTERVAL = 2000;
```

---

## 8. 타입 정의 요약

```typescript
// src/types/pokemon.ts

// 포켓몬 목록 API 응답
export interface PokemonListResponseType {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

// 포켓몬 상세 API 응답
export interface PokemonDetailResponseType {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: PokemonSprites;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
}

// 최근 본 포켓몬 (IndexedDB 저장용)
export interface RecentViewedPokemon {
  name: string;
  url: string;
}
```

---

## 9. 구현 체크리스트

### 상태 관리 구현 순서

| 순서 | 항목                 | 설명                                    |
| :--: | -------------------- | --------------------------------------- |
|  1   | QueryClient 설정     | App.tsx에 Provider 설정                 |
|  2   | API 호출 함수        | remote/pokemon.ts                       |
|  3   | 커스텀 훅            | usePokemonList, usePokemonDetail        |
|  4   | IndexedDB 설정       | 싱글톤 클래스, 초기화                   |
|  5   | 스토어 함수          | getAllRecentPokemon, addRecentPokemon   |
|  6   | useRecentPokemonList | IndexedDB 조회 훅                       |
|  7   | useIndexChange       | 회전 인덱스 훅                          |
|  8   | HOC 적용             | withAsyncBoundary, withAddRecentPokemon |
