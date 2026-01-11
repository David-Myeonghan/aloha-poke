# 검색 결과 없을 시 포켓몬 제안 기능

## 개요

검색 결과가 없을 때 NotFoundPage 하단에 "Did you mean?" 섹션을 추가하여 포켓몬 카드 3개를 애니메이션과 함께 표시한다.

## 현재 구조

```
Header 검색창
    ↓ navigate(`/detail?name={term}`)
DetailPage (usePokemonDetail)
    ↓ API 실패 (404)
ErrorBoundary 캐치
    ↓
NotFoundPage 표시
    - "Not found '{paramName}'" 메시지
    - "Back to List" 버튼
```

## 구현 전략

### UI 구조

```
NotFoundPage
├── "Not found '{paramName}'"
├── "Back to List" 버튼
└── [새로 추가] "Did you mean?" 섹션
    └── 포켓몬 카드 3개 (MainList와 동일한 스타일)
        └── 클릭 시 해당 포켓몬 상세 페이지로 이동
```

### 카드 스타일

MainList의 `card-layout` 스타일 재사용:

- 200px × 210px 카드
- 이미지 + 이름
- 클릭 가능

### 애니메이션

카드가 순차적으로 fade-in + slide-up:

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card:nth-child(1) {
  animation-delay: 0.1s;
}
.card:nth-child(2) {
  animation-delay: 0.2s;
}
.card:nth-child(3) {
  animation-delay: 0.3s;
}
```

## 수정 파일

| 파일                                          | 작업 | 설명                     |
| --------------------------------------------- | ---- | ------------------------ |
| `pages/NotFoundPage/NotFoundPage.tsx`         | 수정 | 제안 카드 섹션 추가      |
| `pages/NotFoundPage/NotFoundPage.module.scss` | 수정 | 카드 스타일 + 애니메이션 |

## 구현 내용

### 1. 포켓몬 데이터 (하드코딩)

```typescript
// ID 포함 (이미지 URL 생성용)
const POPULAR_POKEMON = [
  { name: "pikachu", id: 25 },
  { name: "charizard", id: 6 },
  { name: "bulbasaur", id: 1 },
  { name: "mewtwo", id: 150 },
  { name: "eevee", id: 133 },
  { name: "snorlax", id: 143 },
  { name: "gengar", id: 94 },
  { name: "dragonite", id: 149 },
  { name: "lucario", id: 448 },
  { name: "garchomp", id: 445 },
];
```

### 2. NotFoundPage 수정

```typescript
// NotFoundPage.tsx
const POPULAR_POKEMON = [
  { name: "pikachu", id: 25 },
  { name: "charizard", id: 6 },
  // ... 10개
];

function getRandomSuggestions(count: number) {
  const shuffled = [...POPULAR_POKEMON].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function NotFoundPage() {
  const paramName = useQueryParam("name");
  const navigate = useNavigate();
  const suggestions = useMemo(() => getRandomSuggestions(3), []);

  return (
    <div className={cx("not-found-layout")}>
      <Typography size="t2">Not found "{paramName}"</Typography>
      <Button onClick={() => navigate(ROUTES.index)} color="primary">
        Back to List
      </Button>

      <div className={cx("suggestion-section")}>
        <Typography size="t3">Did you mean?</Typography>
        <div className={cx("suggestion-list")}>
          {suggestions.map((pokemon, index) => (
            <div
              key={pokemon.name}
              className={cx("card")}
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              onClick={() => navigate(`${ROUTES.detail.root}?name=${pokemon.name}`)}
            >
              <LazyLoadImage
                imageSource={`https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
                alt={pokemon.name}
              />
              <Typography size="t3">{pokemon.name}</Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 3. 스타일 추가

```scss
// NotFoundPage.module.scss
.suggestion-section {
  margin-top: 40px;
  text-align: center;
}

.suggestion-list {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
}

.card {
  width: 200px;
  height: 210px;
  padding: 8px 8px 2px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  border: 1px solid map-get(color.$background, border);
  border-radius: 12px;
  background: radial-gradient(
    circle,
    map-get(color.$background, header),
    map-get(color.$background, background-primary)
  );
  cursor: pointer;

  // 애니메이션
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;

  img {
    width: 160px;
    height: 160px;
  }

  p {
    text-transform: capitalize;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## 구현 순서

1. NotFoundPage.tsx에 POPULAR_POKEMON 상수 추가 (name + id)
2. getRandomSuggestions 함수 추가
3. useMemo로 3개 랜덤 선택
4. 카드 JSX 추가 (LazyLoadImage + Typography)
5. NotFoundPage.module.scss에 카드 스타일 + fadeInUp 애니메이션 추가
6. 수동 테스트

## 고려사항

- **useMemo**: 리렌더링 시 suggestions 고정
- **animationDelay**: 순차적 등장 효과
- **text-transform: capitalize**: 포켓몬 이름 첫 글자 대문자
- **LazyLoadImage**: 디자인 시스템 컴포넌트 재사용
