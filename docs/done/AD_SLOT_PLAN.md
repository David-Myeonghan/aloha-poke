# 메인 리스트 광고 슬롯 구현 계획

## 개요

- **대상 페이지**: MainList (`/list`)
- **기능**: 4줄마다 광고 슬롯 삽입 (반응형 - 화면 크기에 따라 동적 계산)
- **광고 스타일**: 전체 너비 (100%), 반응형 배너

---

## 현재 구조 분석

```
MainList.tsx
  ├── usePokemonInfiniteList() → 20개씩 페이지 로드
  ├── allPokemon = data.pages.flatMap(page => page.results)
  └── <PokemonList pokemonList={allPokemon} />

PokemonList.tsx
  └── pokemonList.map(pokemon => <Card />)
```

**그리드 레이아웃**: Flexbox wrap, 카드 200px 고정, 반응형

---

## 구현 전략

### 접근 방식: 리스트 변환

포켓몬 배열을 광고가 포함된 혼합 배열로 변환 후 렌더링

```typescript
// 변환 전
[pokemon1, pokemon2, ..., pokemon20, pokemon21, ...]

// 변환 후 (20개마다 광고)
[pokemon1, ..., pokemon20, AD, pokemon21, ..., pokemon40, AD, ...]
```

---

## 수정/생성 파일 목록

| 파일                                                | 작업 | 설명                    |
| --------------------------------------------------- | ---- | ----------------------- |
| `apps/web/src/hooks/useItemsPerRow.ts`              | 생성 | 한 줄 아이템 수 계산 훅 |
| `apps/web/src/pages/MainList/ui/AdSlot.tsx`         | 생성 | 광고 슬롯 컴포넌트      |
| `apps/web/src/pages/MainList/ui/AdSlot.module.scss` | 생성 | 광고 슬롯 스타일        |
| `apps/web/src/pages/MainList/MainList.tsx`          | 수정 | 광고 삽입 로직          |
| `apps/web/src/pages/MainList/ui/PokemonList.tsx`    | 수정 | 혼합 타입 렌더링        |

---

## 단계별 구현 계획

### Phase 1: AdSlot 컴포넌트 생성

**신규 파일:**

- `apps/web/src/pages/MainList/ui/AdSlot.tsx`

```typescript
import classNames from "classnames/bind";
import { Typography } from "@mydav/design-system";

import styles from "./AdSlot.module.scss";

const cx = classNames.bind(styles);

interface AdSlotProps {
  index: number; // 몇 번째 광고인지
}

export default function AdSlot({ index }: AdSlotProps) {
  return (
    <div className={cx("ad-slot")}>
      <Typography size="t4">AD #{index + 1}</Typography>
      {/* 실제 광고 컨텐츠 또는 플레이스홀더 */}
    </div>
  );
}
```

---

### Phase 2: 광고 슬롯 스타일

**신규 파일:**

- `apps/web/src/pages/MainList/ui/AdSlot.module.scss`

```scss
@use "styles/color.module" as color;

.ad-slot {
  flex-basis: 100%; // flexbox에서 한 줄 전체 차지
  width: 100%;
  height: 120px; // 배너 높이
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: map-get(color.$common, white);
}
```

**핵심 포인트:**

| 속성         | 값    | 설명                          |
| ------------ | ----- | ----------------------------- |
| `flex-basis` | 100%  | 한 줄 전체 차지 (반응형 자동) |
| `width`      | 100%  | 부모 컨테이너 너비에 맞춤     |
| `height`     | 120px | 배너 높이                     |

---

### Phase 3: 타입 정의

**수정 파일:**

- `apps/web/src/pages/MainList/MainList.tsx`

```typescript
import { pokemonType } from "types/pokemon";

type ListItem =
  | { type: "pokemon"; data: pokemonType }
  | { type: "ad"; index: number };
```

---

### Phase 4: 리스트 변환 함수

**수정 파일:**

- `apps/web/src/pages/MainList/MainList.tsx`

```typescript
const AD_INTERVAL = 20;

function insertAds(pokemonList: pokemonType[]): ListItem[] {
  const result: ListItem[] = [];

  pokemonList.forEach((pokemon, i) => {
    result.push({ type: "pokemon", data: pokemon });

    // 20개마다 광고 삽입 (인덱스 19, 39, 59...)
    if ((i + 1) % AD_INTERVAL === 0) {
      result.push({ type: "ad", index: Math.floor(i / AD_INTERVAL) });
    }
  });

  return result;
}
```

---

### Phase 5: MainList 수정

**수정 파일:**

- `apps/web/src/pages/MainList/MainList.tsx`

```typescript
function MainList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePokemonInfiniteList();

  const allPokemon = data?.pages.flatMap((page) => page.results) ?? [];

  // useMemo로 성능 최적화
  const listItems = useMemo(() => insertAds(allPokemon), [allPokemon]);

  const { ref } = useIntersectionObserver({
    onChange: () => fetchNextPage(),
    enabled: hasNextPage && isFetchingNextPage === false,
    threshold: 0.5,
    rootMargin: "100px",
  });

  useScrollRestoration("mainListScrollY");

  return (
    <div className={cx("main-list-layout")}>
      <PokemonList items={listItems} />
      <div ref={ref} className={cx("sentinel")}>
        {isFetchingNextPage && <Loading size="small" />}
      </div>
    </div>
  );
}
```

---

### Phase 6: PokemonList 수정

**수정 파일:**

- `apps/web/src/pages/MainList/ui/PokemonList.tsx`

```typescript
import AdSlot from "./AdSlot";

interface PokemonListProps {
  items: ListItem[];
}

export default function PokemonList({ items }: PokemonListProps) {
  return (
    <div className={cx("List-layout")}>
      {items.map((item) => {
        if (item.type === "ad") {
          return <AdSlot key={`ad-${item.index}`} index={item.index} />;
        }

        const pokemon = item.data;
        const pokemonId = pokemon.url.match(/(?<=\b\/)\d+/)?.["0"];
        return (
          <div key={pokemon.name} className={cx("card-layout")}>
            <LazyLoadImage
              imageSource={`https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`}
              alt={pokemon.name}
            />
            <Typography size={"t3"}>{pokemon.name}</Typography>
          </div>
        );
      })}
    </div>
  );
}
```

---

### Phase 7: index.ts 업데이트

**수정 파일:**

- `apps/web/src/pages/MainList/ui/index.ts`

```typescript
export { default as PokemonList } from "./PokemonList";
export { default as AdSlot } from "./AdSlot";
```

---

## 데이터 흐름

```
페이지 로드 (20개)
    ↓
insertAds() 변환 → [pokemon×20, ad]
    ↓
PokemonList 렌더링 (21개 아이템)
    ↓
스크롤 → 다음 페이지 로드 (40개)
    ↓
insertAds() 변환 → [pokemon×20, ad, pokemon×20, ad]
    ↓
PokemonList 렌더링 (42개 아이템)
```

---

## 고려사항

| 항목      | 설명                                                         |
| --------- | ------------------------------------------------------------ |
| 성능      | `useMemo`로 insertAds 결과 캐싱                              |
| 키        | 광고는 `ad-${index}`, 포켓몬은 기존 `pokemon.name` 사용      |
| 반응형    | `flex-basis: 100%`로 모든 화면 크기에서 한 줄 전체 차지      |
| 동적 간격 | `useItemsPerRow` 훅으로 화면 크기에 따라 광고 간격 자동 조정 |

---

## 반응형 광고 간격

### useItemsPerRow 훅

```typescript
// hooks/useItemsPerRow.ts
const CARD_WIDTH = 200;
const GAP = 12;

export function useItemsPerRow(containerRef: RefObject<HTMLDivElement | null>) {
  const [itemsPerRow, setItemsPerRow] = useState(5);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculateItemsPerRow = () => {
      const containerWidth = container.clientWidth;
      const items = Math.floor((containerWidth + GAP) / (CARD_WIDTH + GAP));
      setItemsPerRow(Math.max(1, items));
    };

    calculateItemsPerRow();

    const resizeObserver = new ResizeObserver(calculateItemsPerRow);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [containerRef]);

  return itemsPerRow;
}
```

### 동적 광고 간격 계산

```typescript
// MainList.tsx
const ROWS_PER_AD = 4;

function MainList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerRow = useItemsPerRow(containerRef);
  const adInterval = itemsPerRow * ROWS_PER_AD;

  const listItems = useMemo(() => {
    const allPokemon = data?.pages.flatMap((page) => page.results) ?? [];
    return insertAds(allPokemon, adInterval);
  }, [data?.pages, adInterval]);
  // ...
}
```

### 화면 크기별 광고 간격

| 화면 너비 | 카드/줄 | 광고 간격 (4줄) |
| --------- | ------- | --------------- |
| ~424px    | 2개     | 8개마다         |
| ~636px    | 3개     | 12개마다        |
| ~848px    | 4개     | 16개마다        |
| ~1060px   | 5개     | 20개마다        |

---

## 구현 순서

1. AdSlot 컴포넌트 + 스타일 생성
2. ListItem 타입 정의
3. insertAds 함수 구현 (MainList.tsx)
4. PokemonList props 변경 및 조건부 렌더링
5. index.ts export 업데이트
6. 수동 테스트 (스크롤하며 광고 위치 확인)
