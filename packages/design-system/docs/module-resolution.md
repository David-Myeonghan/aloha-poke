# 모듈 해석과 배럴 파일 패턴

## 배럴 파일 (index.ts) 패턴

이 프로젝트는 배럴 파일 패턴을 사용하여 깔끔한 import 경로를 제공합니다.

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx        # 실제 컴포넌트
│   │   ├── Button.module.scss
│   │   └── index.ts          # re-export (배럴)
│   ├── Typography/
│   │   └── ...
│   └── index.ts              # 모든 컴포넌트 re-export (배럴)
├── tokens/
│   └── index.ts              # 모든 토큰 re-export (배럴)
└── index.ts                  # 패키지 진입점 (배럴)
```

### 배럴 파일 예시

```typescript
// components/Button/index.ts
export { Button } from "./Button";
export type { ButtonProps, ButtonSize, ButtonColor } from "./Button";

// components/index.ts
export { Button } from "./Button";
export { Typography } from "./Typography";
export { Loading } from "./Loading";
export { LazyLoadImage } from "./LazyLoadImage";
```

### 배럴 파일의 장점

1. **깔끔한 import 경로**
   ```typescript
   // 배럴 파일 사용
   import { Button } from "./components";

   // 배럴 파일 없이
   import { Button } from "./components/Button/Button";
   ```

2. **내부 구조 캡슐화**: 폴더 내부 구조가 변경되어도 외부 import는 영향받지 않음

3. **선택적 export**: 내부에서만 사용하는 유틸 함수는 export하지 않을 수 있음

---

## Node.js 모듈 해석 규칙

`from "./Button"` 형태로 import하면 Node.js는 다음 순서로 파일을 찾습니다:

```
import { Button } from "./Button";

1. ./Button.ts      ← 같은 레벨에 Button.ts 파일? ❌
2. ./Button.tsx     ← 같은 레벨에 Button.tsx 파일? ❌
3. ./Button/index.ts ← Button 폴더 안의 index.ts? ✅ 찾음!
```

### 주의사항

`Button/Button.tsx`는 `./Button/Button.tsx` 경로이므로 `./Button`으로 import할 때 직접 매칭되지 않습니다.

```
components/
├── Button/
│   ├── Button.tsx      ← ./Button/Button.tsx (직접 매칭 안됨)
│   └── index.ts        ← ./Button → ./Button/index.ts (매칭됨)
└── index.ts
```

### 전체 해석 순서

```
import X from "./foo"

1. ./foo (정확히 일치하는 파일)
2. ./foo.ts
3. ./foo.tsx
4. ./foo.js
5. ./foo.jsx
6. ./foo/index.ts
7. ./foo/index.tsx
8. ./foo/index.js
9. ./foo/package.json의 "main" 필드
```

---

## TypeScript moduleResolution 옵션

`tsconfig.json`의 `moduleResolution` 설정은 TypeScript가 어떤 해석 규칙을 따를지 결정합니다:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

### 옵션 비교

| moduleResolution | index.ts 지원 | 확장자 생략 | 용도 |
|------------------|---------------|-------------|------|
| `node` / `node10` | ✅ | ✅ | CommonJS 프로젝트 |
| `node16` / `nodenext` | ✅ | ❌ (ESM) | ESM + CJS 혼용 |
| `bundler` | ✅ | ✅ | Vite, webpack 등 |

### bundler 옵션

이 프로젝트에서 사용하는 `bundler` 옵션은:

- Vite, webpack 같은 번들러가 모듈을 처리할 것을 전제
- `.ts` 확장자 생략 허용
- `index.ts` 패턴 지원
- 가장 유연한 규칙 적용

### node16 / nodenext 옵션

ESM을 엄격하게 따르는 환경에서는:

```typescript
// node16/nodenext에서는 확장자 필수
import { Button } from "./Button.js";  // .ts도 .js로 작성
import { foo } from "./utils/index.js";
```

---

## 참고 자료

- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [Node.js Modules Documentation](https://nodejs.org/api/modules.html)
