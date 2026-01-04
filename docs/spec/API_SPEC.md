# API 명세서

> **Base URL:** `https://pokeapi.co/api/v2/` > **API 제공:** PokéAPI (https://pokeapi.co)

---

## 1. 포켓몬 목록 조회

### 1.1 기본 정보

| 항목         | 값                                  |
| ------------ | ----------------------------------- |
| **Endpoint** | `GET /pokemon`                      |
| **설명**     | 포켓몬 목록을 페이지네이션으로 조회 |
| **인증**     | 불필요                              |

### 1.2 Query Parameters

| 파라미터 | 타입   | 필수 | 기본값 | 설명                                |
| -------- | ------ | :--: | ------ | ----------------------------------- |
| `limit`  | number |  X   | 20     | 한 번에 조회할 포켓몬 수 (최대 100) |
| `offset` | number |  X   | 0      | 시작 위치 (페이지네이션용)          |

### 1.3 요청 예시

```http
GET https://pokeapi.co/api/v2/pokemon?limit=20&offset=0
```

### 1.4 응답

#### 성공 (200 OK)

```json
{
  "count": 1302,
  "next": "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
  "previous": null,
  "results": [
    {
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon/1/"
    },
    {
      "name": "ivysaur",
      "url": "https://pokeapi.co/api/v2/pokemon/2/"
    },
    {
      "name": "venusaur",
      "url": "https://pokeapi.co/api/v2/pokemon/3/"
    }
    // ... 최대 limit 개수만큼
  ]
}
```

#### 응답 필드 설명

| 필드             | 타입           | 설명                      |
| ---------------- | -------------- | ------------------------- |
| `count`          | number         | 전체 포켓몬 수            |
| `next`           | string \| null | 다음 페이지 URL           |
| `previous`       | string \| null | 이전 페이지 URL           |
| `results`        | array          | 포켓몬 목록               |
| `results[].name` | string         | 포켓몬 이름 (영문 소문자) |
| `results[].url`  | string         | 상세 정보 API URL         |

### 1.5 포켓몬 ID 추출 방법

`url` 필드에서 포켓몬 ID를 추출:

```typescript
const url = "https://pokeapi.co/api/v2/pokemon/1/";
const pokemonId = url.match(/\/pokemon\/(\d+)\//)?.[1];
// 결과: "1"
```

---

## 2. 포켓몬 상세 조회

### 2.1 기본 정보

| 항목         | 값                            |
| ------------ | ----------------------------- |
| **Endpoint** | `GET /pokemon/{id 또는 name}` |
| **설명**     | 특정 포켓몬의 상세 정보 조회  |
| **인증**     | 불필요                        |

### 2.2 Path Parameters

| 파라미터 | 타입   | 필수 | 설명                        |
| -------- | ------ | :--: | --------------------------- |
| `id`     | number | O\*  | 포켓몬 도감 번호 (1 ~ 1025) |
| `name`   | string | O\*  | 포켓몬 이름 (영문 소문자)   |

> \*id 또는 name 중 하나만 사용

### 2.3 요청 예시

```http
# ID로 조회
GET https://pokeapi.co/api/v2/pokemon/1

# 이름으로 조회
GET https://pokeapi.co/api/v2/pokemon/bulbasaur
```

### 2.4 응답

#### 성공 (200 OK)

```json
{
  "id": 1,
  "name": "bulbasaur",
  "height": 7,
  "weight": 69,
  "base_experience": 64,
  "sprites": {
    "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png",
    "other": {
      "dream_world": {
        "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg"
      },
      "official-artwork": {
        "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
      }
    }
  },
  "types": [
    {
      "slot": 1,
      "type": {
        "name": "grass",
        "url": "https://pokeapi.co/api/v2/type/12/"
      }
    },
    {
      "slot": 2,
      "type": {
        "name": "poison",
        "url": "https://pokeapi.co/api/v2/type/4/"
      }
    }
  ],
  "stats": [
    {
      "base_stat": 45,
      "effort": 0,
      "stat": {
        "name": "hp",
        "url": "https://pokeapi.co/api/v2/stat/1/"
      }
    },
    {
      "base_stat": 49,
      "effort": 0,
      "stat": {
        "name": "attack",
        "url": "https://pokeapi.co/api/v2/stat/2/"
      }
    },
    {
      "base_stat": 49,
      "effort": 0,
      "stat": {
        "name": "defense",
        "url": "https://pokeapi.co/api/v2/stat/3/"
      }
    },
    {
      "base_stat": 65,
      "effort": 1,
      "stat": {
        "name": "special-attack",
        "url": "https://pokeapi.co/api/v2/stat/4/"
      }
    },
    {
      "base_stat": 65,
      "effort": 0,
      "stat": {
        "name": "special-defense",
        "url": "https://pokeapi.co/api/v2/stat/5/"
      }
    },
    {
      "base_stat": 45,
      "effort": 0,
      "stat": {
        "name": "speed",
        "url": "https://pokeapi.co/api/v2/stat/6/"
      }
    }
  ],
  "abilities": [
    {
      "ability": {
        "name": "overgrow",
        "url": "https://pokeapi.co/api/v2/ability/65/"
      },
      "is_hidden": false,
      "slot": 1
    },
    {
      "ability": {
        "name": "chlorophyll",
        "url": "https://pokeapi.co/api/v2/ability/34/"
      },
      "is_hidden": true,
      "slot": 3
    }
  ]
}
```

#### 응답 필드 설명

| 필드              | 타입   | 설명                            |
| ----------------- | ------ | ------------------------------- |
| `id`              | number | 도감 번호                       |
| `name`            | string | 포켓몬 이름 (영문)              |
| `height`          | number | 키 (단위: 0.1m) → 7 = 0.7m      |
| `weight`          | number | 무게 (단위: 0.1kg) → 69 = 6.9kg |
| `base_experience` | number | 기본 경험치                     |
| `sprites`         | object | 이미지 URL 모음                 |
| `types`           | array  | 타입 목록 (최대 2개)            |
| `stats`           | array  | 능력치 목록 (6개)               |
| `abilities`       | array  | 특성 목록                       |

#### Stats 필드 상세

| stat.name         | 설명        | 최대값 참고         |
| ----------------- | ----------- | ------------------- |
| `hp`              | 체력        | 255 (Blissey)       |
| `attack`          | 공격력      | 190 (Mega Mewtwo X) |
| `defense`         | 방어력      | 230 (Mega Steelix)  |
| `special-attack`  | 특수 공격력 | 194 (Mega Mewtwo Y) |
| `special-defense` | 특수 방어력 | 230 (Shuckle)       |
| `speed`           | 스피드      | 180 (Regieleki)     |

#### 에러 (404 Not Found)

```json
"Not Found"
```

> 존재하지 않는 ID나 이름으로 조회 시

---

## 3. 이미지 URL 패턴

### 3.1 스프라이트 이미지 (GitHub Raw)

| 이미지 종류   | URL 패턴                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| 기본 정면     | `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png`                        |
| 기본 후면     | `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/{id}.png`                   |
| Dream World   | `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/{id}.svg`      |
| 공식 아트워크 | `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png` |

### 3.2 이미지 사용 예시

```typescript
const pokemonId = 1;

const images = {
  default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
  dreamWorld: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`,
  artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
};
```

---

## 4. TypeScript 타입 정의

### 4.1 포켓몬 목록 응답

```typescript
interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

interface PokemonListItem {
  name: string;
  url: string;
}
```

### 4.2 포켓몬 상세 응답

```typescript
interface PokemonDetailResponse {
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

interface PokemonSprites {
  front_default: string;
  back_default: string;
  other: {
    dream_world: {
      front_default: string;
    };
    "official-artwork": {
      front_default: string;
    };
  };
}

interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}
```

### 4.3 최근 본 포켓몬 (로컬 저장용)

```typescript
interface RecentViewedPokemon {
  name: string; // 포켓몬 이름
  url: string; // 상세 페이지 경로 (예: "/detail?name=bulbasaur")
}
```

---

## 5. API 호출 예시 코드

### 5.1 HTTP 클라이언트 설정 (ky)

```typescript
// src/utils/ajax/instance.ts
import ky from "ky";

const BASE_URL = "https://pokeapi.co/api/v2/";

export const api = ky.create({
  prefixUrl: BASE_URL,
  timeout: 10000, // 10초
});
```

### 5.2 API 엔드포인트 함수

```typescript
// src/constants/api.ts
interface PokemonListParams {
  limit?: number;
  offset?: number;
}

export const pokemonList = (params: PokemonListParams = {}) => {
  const { limit = 20, offset = 0 } = params;
  return `pokemon?limit=${limit}&offset=${offset}`;
};

export const pokemonDetail = (idOrName: string | number) => {
  return `pokemon/${idOrName}`;
};
```

### 5.3 API 호출 함수

```typescript
// src/remote/pokemon.ts
import { api } from "utils/ajax/instance";
import { pokemonList, pokemonDetail } from "constants/api";

export const getPokemonList = async (params: PokemonListParams) => {
  return api.get(pokemonList(params)).json<PokemonListResponse>();
};

export const getPokemonDetail = async (idOrName: string) => {
  return api.get(pokemonDetail(idOrName)).json<PokemonDetailResponse>();
};
```

---

## 6. 에러 처리

### 6.1 예상 에러 상황

| HTTP 상태     | 상황                 | 처리 방법               |
| ------------- | -------------------- | ----------------------- |
| 404           | 존재하지 않는 포켓몬 | 에러 페이지 표시        |
| 500           | 서버 오류            | 재시도 또는 에러 페이지 |
| Network Error | 네트워크 연결 없음   | 오프라인 안내           |
| Timeout       | 응답 지연            | 재시도 버튼 표시        |

### 6.2 React Query 에러 처리

```typescript
// ErrorBoundary와 함께 사용
const { data } = useSuspenseQuery({
  queryKey: ["pokemon-detail", name],
  queryFn: () => getPokemonDetail(name),
  retry: 2, // 실패 시 2번 재시도
  staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
});
```

---

## 7. Rate Limiting

| 항목     | 값                   |
| -------- | -------------------- |
| **제한** | 없음 (공개 API)      |
| **권장** | 초당 100 요청 이하   |
| **캐싱** | 클라이언트 캐싱 권장 |

> PokéAPI는 무료 공개 API로, 별도의 API 키나 인증이 필요하지 않습니다.
> 다만, 과도한 요청은 자제하고 클라이언트 캐싱(React Query)을 활용하세요.
