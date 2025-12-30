# 디자인 토큰

디자인 토큰은 `.ts`와 `.scss` 두 가지 형식으로 제공됩니다.

## 토큰 형식 비교

| 파일 | 사용처 | 용도 |
|------|--------|------|
| `.ts` | 외부 사용자 | JS/TS 코드에서 동적 스타일링, 테마 접근 |
| `.scss` | 디자인 시스템 내부 | 컴포넌트 `.module.scss` 파일에서 import |

## 토큰 중복과 리소스 효율성

`.ts`와 `.scss`에 동일한 값이 있지만, 빌드 결과물 기준으로 낭비가 거의 없습니다.

| 토큰 | 빌드 후 | 포함 조건 |
|------|---------|----------|
| SCSS | CSS에 인라인됨 (변수 사라짐) | 항상 (컴포넌트 스타일) |
| TS | JS 번들에 포함 | `import` 할 때만 (tree-shaking) |

```scss
// 빌드 전 (SCSS)
background: map-get($primary, main);

// 빌드 후 (CSS) - 변수 없음, 값만 남음
background: #3196ef;
```

**실제 시나리오:**
- 컴포넌트만 사용: CSS만 로드됨 (TS 토큰 tree-shaken)
- TS 토큰도 import: 수백 바이트 추가 (무시할 수준)

---

## CSS Modules vs CSS-in-JS

이 디자인 시스템은 CSS Modules + SCSS 방식을 사용합니다. CSS-in-JS(styled-components, emotion 등) 대비 장점:

### CSS-in-JS 런타임 오버헤드

1. **스타일 계산**: props 변경 시 매 렌더마다 JS로 스타일 재계산
2. **동적 CSS 주입**: 런타임에 `<style>` 태그 생성/수정 → DOM 조작 및 CSSOM 재파싱 비용
3. **번들 크기**: 라이브러리 추가 (styled-components ~12KB, emotion ~7KB)

### 성능 비교

| | CSS Modules (현재) | CSS-in-JS |
|--|-------------------|-----------|
| 스타일 계산 | 빌드타임 | 런타임 |
| CSS 생성 | 빌드타임 | 런타임 |
| JS 번들 | 작음 | 라이브러리 포함 |
| 초기 로딩 | 빠름 | 느림 |
| 저사양 기기 | 영향 없음 | 성능 저하 체감 |

**결론**: CSS Modules + SCSS는 빌드타임에 모든 처리가 완료되어 런타임 비용이 0입니다.

---

## 토큰 사용법

### TypeScript 토큰 (.ts)

JS/TS 코드에서 런타임에 토큰 값에 접근할 때 사용합니다.

```typescript
import { colors, typography } from '@mydav/design-system/tokens';

// 인라인 스타일
<div style={{ color: colors.primary.main }} />

// styled-components, emotion 등
const Button = styled.button`
  background: ${colors.primary.main};
`;

// 조건부 스타일링
const bgColor = isError ? colors.error.main : colors.primary.main;
```

### SCSS 토큰 (.scss)

디자인 시스템 내부 컴포넌트 스타일링에 사용됩니다.

```scss
// Button.module.scss
@use '@/tokens/colors.scss' as color;
@use '@/tokens/typography.scss' as typo;

.primary {
  background-color: map-get(color.$primary, main);
  @include typo.t2;
}
```

### CSS 커스텀 프로퍼티

토큰은 CSS 커스텀 프로퍼티로도 제공됩니다.

```css
.my-element {
  color: var(--color-primary-main);
  font-size: var(--typography-t1-font-size);
}
```

---

## 토큰 값

### Colors

```typescript
const colors = {
  primary: {
    light: "#71b3ff",
    main: "#3196ef",
    dark: "#0062b7",
  },
  error: {
    light: "#f3869d",
    main: "#ec3a5d",
    dark: "#c5082f",
  },
  common: {
    white: "#fff",
    black: "#000",
    grey: "#727274",
  },
  background: {
    header: "#1f2949",
    primary: "#5b92d3",
    secondary: "#6e7c99",
    border: "#98a6c0",
  },
};
```

### Typography

```typescript
const typography = {
  t1: { fontSize: "32px", lineHeight: "44px", fontWeight: 700 },
  t2: { fontSize: "24px", lineHeight: "34px", fontWeight: 700 },
  t3: { fontSize: "18px", lineHeight: "28px", fontWeight: 600 },
  t4: { fontSize: "16px", lineHeight: "24px", fontWeight: 400 },
};
```
