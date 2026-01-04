# 컴포넌트 설계서

> 이 문서는 Aloha Poke 앱의 컴포넌트 구조와 상세 명세를 정의합니다.

---

## 1. 컴포넌트 계층 구조

```
App
└── QueryClientProvider
    └── ErrorBoundary (전역)
        └── RouterProvider
            └── Header (Layout)
                ├── Logo
                ├── RecentView
                ├── SearchBox (미구현)
                └── Outlet
                    ├── MainList (페이지)
                    │   └── PokemonList
                    │       └── PokemonCard
                    │           └── LazyLoadImage
                    └── DetailPage (페이지)
                        ├── PokemonImages
                        │   └── LazyLoadImage (x3)
                        ├── PokemonIntro
                        └── PokemonStats
```

---

## 2. 공통 컴포넌트

### 2.1 Button

#### 파일 위치

```
src/components/Button/
├── Button.tsx
└── Button.module.scss
```

#### Props 정의

```typescript
interface ButtonProps {
  size?: "small" | "medium" | "massive";
  color?: "primary" | "error";
  children?: React.ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}
```

#### Props 상세

| Prop       | 타입      | 필수 | 기본값      | 설명                  |
| ---------- | --------- | :--: | ----------- | --------------------- |
| `size`     | string    |  X   | `"medium"`  | 버튼 크기             |
| `color`    | string    |  X   | `"primary"` | 버튼 색상 테마        |
| `children` | ReactNode |  X   | -           | 버튼 내부 텍스트/요소 |
| `onClick`  | function  |  O   | -           | 클릭 이벤트 핸들러    |

#### 사이즈별 스타일

| Size      | Padding   | Font Size | 용도      |
| --------- | --------- | --------- | --------- |
| `small`   | 8px 16px  | 14px      | 보조 버튼 |
| `medium`  | 12px 24px | 16px      | 기본 버튼 |
| `massive` | 16px 32px | 18px      | 강조 버튼 |

#### 사용 예시

```tsx
// Primary 버튼 (기본)
<Button onClick={handleClick}>확인</Button>

// Error 버튼 (Small)
<Button size="small" color="error" onClick={handleCancel}>
  취소
</Button>
```

---

### 2.2 Typography

#### 파일 위치

```
src/components/Typography/
├── Typography.tsx
└── Typography.module.scss
```

#### Props 정의

```typescript
interface TypographyProps {
  children?: React.ReactNode;
  size: "t1" | "t2" | "t3" | "t4";
  tag?: keyof JSX.IntrinsicElements;
}
```

#### Props 상세

| Prop       | 타입      | 필수 | 기본값           | 설명             |
| ---------- | --------- | :--: | ---------------- | ---------------- |
| `children` | ReactNode |  X   | -                | 텍스트 내용      |
| `size`     | string    |  O   | -                | 텍스트 크기 레벨 |
| `tag`      | string    |  X   | size에 따라 자동 | HTML 태그        |

#### 사이즈별 스타일

| Size | Font Size | 기본 Tag | 용도        |
| ---- | --------- | -------- | ----------- |
| `t1` | 32px      | `<h1>`   | 페이지 제목 |
| `t2` | 24px      | `<h2>`   | 섹션 제목   |
| `t3` | 18px      | `<p>`    | 본문 텍스트 |
| `t4` | 16px      | `<p>`    | 보조 텍스트 |

#### 사용 예시

```tsx
// 페이지 제목
<Typography size="t1">Bulbasaur</Typography>

// 커스텀 태그
<Typography size="t3" tag="span">Type: Grass</Typography>
```

---

### 2.3 LazyLoadImage

#### 파일 위치

```
src/components/LazyLoadImage/
├── LazyLoadImage.tsx
└── LazyLoadImage.module.scss
```

#### Props 정의

```typescript
interface LazyLoadImageProps {
  src: string;
  alt: string;
  className?: string;
}
```

#### Props 상세

| Prop        | 타입   | 필수 | 기본값 | 설명            |
| ----------- | ------ | :--: | ------ | --------------- |
| `src`       | string |  O   | -      | 이미지 URL      |
| `alt`       | string |  O   | -      | 대체 텍스트     |
| `className` | string |  X   | -      | 추가 CSS 클래스 |

#### 동작 방식

```
초기 상태:
├── Loading 컴포넌트: display: block
└── img 태그: visibility: hidden

이미지 로드 완료 후:
├── Loading 컴포넌트: display: none
└── img 태그: visibility: visible
```

#### 내부 구현

```tsx
export default function LazyLoadImage({
  src,
  alt,
  className,
}: LazyLoadImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    const loadingElement = loadingRef.current;
    if (!imageElement || !loadingElement) return;

    const handleLoad = () => {
      loadingElement.style.display = "none";
      imageElement.style.visibility = "visible";
    };

    imageElement.onload = handleLoad;
  }, []);

  return (
    <div className={cx("container")}>
      <div ref={loadingRef}>
        <Loading />
      </div>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        loading="lazy"
        className={className}
      />
    </div>
  );
}
```

---

### 2.4 Loading

#### 파일 위치

```
src/components/Loading/
├── Loading.tsx
└── Loading.module.scss
```

#### Props 정의

```typescript
interface LoadingProps {
  // Props 없음 (단순 표시용)
}
```

#### 스타일 명세

| 속성       | 값                                |
| ---------- | --------------------------------- |
| 타입       | CSS 스피너 애니메이션             |
| 크기       | 40px x 40px                       |
| 색상       | Primary Main (#3196ef)            |
| 애니메이션 | 360도 회전 (1s, linear, infinite) |

---

## 3. 레이아웃 컴포넌트

### 3.1 Header

#### 파일 위치

```
src/components/Header/
├── Header.tsx
├── Header.module.scss
├── RecentView.tsx
└── RecentView.module.scss
```

#### 구조

```tsx
<header>
  <Logo /> {/* 왼쪽: 브랜드 로고 */}
  <RecentView /> {/* 중앙: 최근 본 포켓몬 */}
  <SearchBox /> {/* 오른쪽: 검색 (미구현) */}
  <Outlet /> {/* 하위 라우트 렌더링 */}
</header>
```

#### 레이아웃 명세

| 영역       | 너비    | 정렬   |
| ---------- | ------- | ------ |
| Logo       | auto    | left   |
| RecentView | flex: 1 | center |
| SearchBox  | auto    | right  |

---

### 3.2 RecentView

#### Props 정의

```typescript
interface RecentViewProps {
  // Props 없음 (내부 상태 사용)
}
```

#### 내부 상태

```typescript
const [recentPokemonList, setRecentPokemonList] = useState<
  RecentViewedPokemon[]
>([]);
const { index } = useIndexChange(recentPokemonList.length);
```

#### 동작 방식

1. 컴포넌트 마운트 시 IndexedDB에서 최근 본 목록 조회
2. `useIndexChange` 훅으로 2초마다 표시할 인덱스 변경
3. 현재 인덱스의 포켓몬 이름 표시
4. 이름 클릭 시 해당 상세 페이지로 이동

#### 렌더링 조건

```typescript
// 최근 본 포켓몬이 없으면 렌더링하지 않음
if (recentPokemonList.length === 0) {
  return null;
}
```

---

## 4. 페이지 컴포넌트

### 4.1 MainList

#### 파일 위치

```
src/pages/MainList/
├── MainList.tsx
├── MainList.module.scss
└── ui/
    ├── PokemonList.tsx
    └── PokemonList.module.scss
```

#### HOC 적용

```typescript
export default withAsyncBoundary(MainList, {
  pendingFallback: <Loading />,
  rejectedFallback: <ErrorPage />,
});
```

#### 내부 구조

```tsx
function MainList() {
  const { data: pokemonList } = usePokemonList({ limit: 20 });

  return (
    <main>
      <PokemonList pokemons={pokemonList.results} />
    </main>
  );
}
```

---

### 4.2 PokemonList

#### Props 정의

```typescript
interface PokemonListProps {
  pokemons: PokemonListItem[];
}

interface PokemonListItem {
  name: string;
  url: string;
}
```

#### 렌더링 로직

```tsx
function PokemonList({ pokemons }: PokemonListProps) {
  const navigate = useNavigate();

  return (
    <ul className={cx("grid")}>
      {pokemons.map((pokemon) => {
        // URL에서 ID 추출
        const pokemonId = pokemon.url.match(/(?<=\b\/)\d+/)?.["0"];

        // 이미지 URL 생성
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`;

        return (
          <li
            key={pokemon.name}
            onClick={() => navigate(`/detail?name=${pokemon.name}`)}
          >
            <LazyLoadImage src={imageUrl} alt={pokemon.name} />
            <Typography size="t3">{pokemon.name}</Typography>
          </li>
        );
      })}
    </ul>
  );
}
```

#### 그리드 레이아웃

```scss
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  padding: 16px;
}
```

---

### 4.3 DetailPage

#### 파일 위치

```
src/pages/DetailPage/
├── DetailPage.tsx
├── DetailPage.module.scss
└── ui/
    ├── PokemonImages.tsx
    ├── PokemonImages.module.scss
    ├── PokemonIntro.tsx
    ├── PokemonIntro.module.scss
    ├── PokemonStats.tsx
    └── PokemonStats.module.scss
```

#### HOC 적용

```typescript
// 두 개의 HOC 중첩 적용
export default withAsyncBoundary(
  withAddRecentPokemon(DetailPage),
  {
    pendingFallback: <Loading />,
    rejectedFallback: <ErrorPage />,
  }
);
```

#### Props (URL Query)

| Query Param | 타입   | 필수 | 설명                |
| ----------- | ------ | :--: | ------------------- |
| `name`      | string |  O   | 포켓몬 이름 또는 ID |

#### 내부 구조

```tsx
function DetailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const pokemonName = queryParams.get("name") ?? "";

  const { data: pokemon } = usePokemonDetail(pokemonName);

  return (
    <main>
      <Button onClick={() => navigate("/list")}>Back</Button>
      <PokemonImages pokemon={pokemon} />
      <PokemonIntro pokemon={pokemon} />
      <PokemonStats pokemon={pokemon} />
    </main>
  );
}
```

---

### 4.4 PokemonImages

#### Props 정의

```typescript
interface PokemonImagesProps {
  pokemon: PokemonDetailResponse;
}
```

#### 표시 이미지

| 순서 | 이미지 소스                                       | 설명               |
| :--: | ------------------------------------------------- | ------------------ |
|  1   | `sprites.front_default`                           | 기본 스프라이트    |
|  2   | `sprites.other.dream_world.front_default`         | Dream World 스타일 |
|  3   | `sprites.other["official-artwork"].front_default` | 공식 아트워크      |

#### 렌더링

```tsx
function PokemonImages({ pokemon }: PokemonImagesProps) {
  const images = [
    pokemon.sprites.front_default,
    pokemon.sprites.other.dream_world.front_default,
    pokemon.sprites.other["official-artwork"].front_default,
  ];

  return (
    <div className={cx("images")}>
      {images.map((src, index) => (
        <LazyLoadImage key={index} src={src} alt={pokemon.name} />
      ))}
    </div>
  );
}
```

---

### 4.5 PokemonIntro

#### Props 정의

```typescript
interface PokemonIntroProps {
  pokemon: PokemonDetailResponse;
}
```

#### 표시 정보

| 필드 | 소스             | 변환             |
| ---- | ---------------- | ---------------- |
| 이름 | `pokemon.name`   | 첫 글자 대문자   |
| ID   | `pokemon.id`     | `#001` 형식      |
| 키   | `pokemon.height` | `÷ 10` → `0.7m`  |
| 무게 | `pokemon.weight` | `÷ 10` → `6.9kg` |
| 타입 | `pokemon.types`  | 쉼표로 구분      |

#### 데이터 변환 예시

```typescript
// 이름 변환
const displayName =
  pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
// "bulbasaur" → "Bulbasaur"

// ID 변환
const displayId = `#${String(pokemon.id).padStart(3, "0")}`;
// 1 → "#001"

// 키 변환
const displayHeight = `${(pokemon.height / 10).toFixed(1)}m`;
// 7 → "0.7m"

// 무게 변환
const displayWeight = `${(pokemon.weight / 10).toFixed(1)}kg`;
// 69 → "6.9kg"

// 타입 변환
const displayTypes = pokemon.types.map((t) => t.type.name).join(", ");
// ["grass", "poison"] → "grass, poison"
```

---

### 4.6 PokemonStats

#### Props 정의

```typescript
interface PokemonStatsProps {
  pokemon: PokemonDetailResponse;
}
```

#### 스탯 표시

| stat.name         | 한글 표시 | 최대값 (바 기준) |
| ----------------- | --------- | ---------------- |
| `hp`              | HP        | 255              |
| `attack`          | Attack    | 255              |
| `defense`         | Defense   | 255              |
| `special-attack`  | Sp. Atk   | 255              |
| `special-defense` | Sp. Def   | 255              |
| `speed`           | Speed     | 255              |

#### 프로그레스 바 계산

```typescript
// base_stat을 퍼센트로 변환 (최대 255 기준)
const percentage = (stat.base_stat / 255) * 100;

// 또는 간단히 그대로 사용 (base_stat이 보통 0~200 범위)
const width = `${stat.base_stat}%`;
```

#### 렌더링

```tsx
function PokemonStats({ pokemon }: PokemonStatsProps) {
  return (
    <div className={cx("stats")}>
      {pokemon.stats.map((stat) => (
        <div key={stat.stat.name} className={cx("stat-row")}>
          <span className={cx("stat-name")}>{stat.stat.name}</span>
          <div className={cx("stat-bar")}>
            <div
              className={cx("stat-fill")}
              style={{ width: `${stat.base_stat}%` }}
            />
          </div>
          <span className={cx("stat-value")}>{stat.base_stat}</span>
        </div>
      ))}
    </div>
  );
}
```

---

### 4.7 ErrorPage

#### 파일 위치

```
src/pages/ErrorPage/
├── ErrorPage.tsx
└── ErrorPage.module.scss
```

#### 표시 내용

```tsx
function ErrorPage() {
  return (
    <div className={cx("error")}>
      <Typography size="t1">Something's wrong!</Typography>
      <Typography size="t3">Please try again later.</Typography>
    </div>
  );
}
```

---

## 5. HOC (고차 컴포넌트)

### 5.1 withAsyncBoundary

#### 파일 위치

```
src/utils/HOC/withAsyncBoundary.tsx
```

#### 시그니처

```typescript
function withAsyncBoundary<Props>(
  WrappedComponent: ComponentType<Props>,
  options: {
    pendingFallback: React.ReactNode;
    rejectedFallback: React.ReactNode;
  },
): ComponentType<Props>;
```

#### 동작

```tsx
// 내부 구현
return (props: Props) => (
  <ErrorBoundary fallback={rejectedFallback}>
    <Suspense fallback={pendingFallback}>
      <WrappedComponent {...props} />
    </Suspense>
  </ErrorBoundary>
);
```

#### 사용 예시

```typescript
export default withAsyncBoundary(MainList, {
  pendingFallback: <Loading />,
  rejectedFallback: <ErrorPage />,
});
```

---

### 5.2 withAddRecentPokemon

#### 파일 위치

```
src/utils/HOC/withAddRecentPokemon.tsx
```

#### 시그니처

```typescript
function withAddRecentPokemon<Props>(
  WrappedComponent: ComponentType<Props>,
): ComponentType<Props>;
```

#### 동작

1. URL에서 `name` 쿼리 파라미터 추출
2. 현재 경로 저장 (`/detail?name=bulbasaur`)
3. IndexedDB에 최근 본 포켓몬 정보 저장
4. 원본 컴포넌트 렌더링

#### 내부 구현

```tsx
return (props: Props) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramName = queryParams.get("name");
  const currentPath = `${location.pathname}${location.search}`;

  useEffect(() => {
    if (!paramName) return;

    const recent: RecentViewedPokemon = {
      name: paramName,
      url: currentPath,
    };

    addRecentPokemon(RECENT_VIEW, recent);
  }, [paramName, currentPath]);

  return <WrappedComponent {...props} />;
};
```

---

## 6. 컴포넌트 체크리스트

### 구현 시 확인사항

| 컴포넌트      | 로딩 상태 | 에러 처리 | 반응형 | 접근성 |
| ------------- | :-------: | :-------: | :----: | :----: |
| Button        |     -     |     -     |   O    |   O    |
| Typography    |     -     |     -     |   O    |   O    |
| LazyLoadImage |     O     |     -     |   O    |   O    |
| Loading       |     -     |     -     |   O    |   -    |
| Header        |     -     |     -     |   O    |   O    |
| RecentView    |     O     |     -     |   O    |   O    |
| MainList      |     O     |     O     |   O    |   O    |
| PokemonList   |     -     |     -     |   O    |   O    |
| DetailPage    |     O     |     O     |   O    |   O    |
| PokemonImages |     O     |     -     |   O    |   O    |
| PokemonIntro  |     -     |     -     |   O    |   O    |
| PokemonStats  |     -     |     -     |   O    |   O    |
| ErrorPage     |     -     |     -     |   O    |   O    |

---

## 7. 파일 구조 컨벤션

### 컴포넌트 폴더 구조

```
ComponentName/
├── ComponentName.tsx       # 컴포넌트 로직
├── ComponentName.module.scss  # 스타일
└── index.ts               # (선택) 배럴 파일
```

### 네이밍 컨벤션

| 대상        | 규칙                    | 예시                      |
| ----------- | ----------------------- | ------------------------- |
| 컴포넌트    | PascalCase              | `PokemonList`             |
| 파일명      | PascalCase              | `PokemonList.tsx`         |
| 스타일 파일 | PascalCase.module.scss  | `PokemonList.module.scss` |
| 훅          | camelCase (use 접두사)  | `usePokemonList`          |
| HOC         | camelCase (with 접두사) | `withAsyncBoundary`       |
