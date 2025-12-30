# FAQ

## 1. `workspace:*` 프로토콜이란?

```json
"@mydav/design-system": "workspace:*"
```

`workspace:*`는 pnpm 워크스페이스 프로토콜입니다.

| 부분 | 의미 |
|------|------|
| `workspace:` | 로컬 워크스페이스 패키지 참조 |
| `*` | 해당 패키지의 현재 버전 사용 |

### 동작 방식

```
개발 시 (pnpm install):
→ node_modules/@mydav/design-system가 packages/design-system을 심볼릭 링크

배포 시 (npm publish):
→ "workspace:*"가 실제 버전 "0.1.0"으로 자동 변환
```

### 버전 지정 옵션

| 프로토콜 | 변환 결과 | 설명 |
|----------|-----------|------|
| `workspace:*` | `0.1.0` | 정확한 현재 버전 |
| `workspace:^` | `^0.1.0` | 호환 버전 (minor 업데이트 허용) |
| `workspace:~` | `~0.1.0` | 패치 버전만 허용 |

모노레포에서 로컬 패키지를 npm에서 가져오지 않고 바로 참조할 수 있게 해줍니다.

---

## 2. 스타일 import와 CSS 커스텀 프로퍼티

```typescript
import "@mydav/design-system/styles";
```

이 import를 하면 `colors.scss`에 정의된 `:root` CSS 커스텀 프로퍼티들이 브라우저에 로드됩니다.

### 포함되는 내용

```css
/* dist/design-system.css */
:root {
  --color-primary-light: #71b3ff;
  --color-primary-main: #3196ef;
  --color-primary-dark: #0062b7;
  --color-error-light: #f3869d;
  --color-error-main: #ec3a5d;
  /* ... */
}
```

### 확인 방법

브라우저 DevTools → Elements 탭 → `:root` 또는 `html` 선택 → Styles 패널에서 모든 커스텀 프로퍼티 확인 가능

### 앱에서 사용

```css
/* apps/web의 SCSS 파일에서 */
.my-element {
  color: var(--color-primary-main);
  background: var(--color-background-header);
}
```

---

## 3. re-export vs 직접 import

### re-export 방식 (기존)

```typescript
// components/index.ts
export { Button, Typography } from "@mydav/design-system";

// 사용처
import { Button } from "components";
```

### 직접 import 방식 (현재)

```typescript
// 사용처
import { Button } from "@mydav/design-system";
```

### 비교

| | re-export | 직접 import |
|--|-----------|-------------|
| 출처 명확성 | △ 중간 레이어 | ◎ 바로 알 수 있음 |
| 코드 변경량 | ◎ 적음 | △ 파일마다 수정 |
| 번들 최적화 | △ 추가 레이어 | ◎ 직접 참조 |
| 유지보수 | △ 중간 파일 관리 | ◎ 단순함 |

### 결론

직접 import가 더 명확하고 유지보수하기 좋습니다. 패키지 출처가 바로 보이고, 불필요한 중간 레이어가 없습니다.
