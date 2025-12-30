# @mydav/design-system 디자인 시스템 분리 배포 계획

## 개요

- **패키지명**: `@mydav/design-system`
- **구조**: pnpm 모노레포 + Turborepo
- **배포**: npm 공개 레지스트리
- **문서화**: Storybook 포함

---

## 최종 디렉토리 구조

```
alohapoke/
├── packages/
│   └── design-system/          # @mydav/design-system
│       ├── src/
│       │   ├── components/
│       │   │   ├── Button/
│       │   │   ├── Typography/
│       │   │   ├── Loading/
│       │   │   ├── LazyLoadImage/
│       │   │   └── index.ts
│       │   ├── tokens/
│       │   │   ├── colors.ts / colors.scss
│       │   │   ├── typography.ts / typography.scss
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── .storybook/
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── apps/
│   └── web/                    # 기존 alohapoke 앱
├── pnpm-workspace.yaml
├── turbo.json                  # Turborepo 설정
└── package.json
```

---

## 분리 대상 컴포넌트

| 컴포넌트      | 현재 위치                       | Props                          |
| ------------- | ------------------------------- | ------------------------------ |
| Button        | `src/components/Button/`        | size, color, onClick, children |
| Typography    | `src/components/Typography/`    | size, tag, children            |
| Loading       | `src/components/Loading/`       | size                           |
| LazyLoadImage | `src/components/LazyLoadImage/` | imageSource, alt               |

---

## 디자인 토큰

| 토큰       | 현재 위치                      |
| ---------- | ------------------------------ |
| Colors     | `src/styles/color.module.scss` |
| Typography | `src/styles/text.module.scss`  |

---

## 단계별 구현 계획

### Phase 1: 모노레포 기본 구조 설정

**작업 내용:**

1. 루트 `pnpm-workspace.yaml` 생성
2. 루트 `package.json` 생성 (workspace 스크립트)
3. `turbo.json` 생성 (Turborepo 설정)
4. `apps/web/` 디렉토리 생성 및 기존 앱 코드 이동
5. `pnpm install`로 의존성 재설치 확인

**신규/수정 파일:**

- `pnpm-workspace.yaml` (신규)
- `turbo.json` (신규)
- `package.json` (루트, 신규)
- 기존 앱 → `apps/web/` (이동)

---

### Phase 2: 디자인 시스템 패키지 초기화

**작업 내용:**

1. `packages/design-system/` 디렉토리 구조 생성
2. `package.json` 생성 (exports, peerDependencies 설정)
3. `vite.config.ts` 생성 (라이브러리 빌드 모드)
4. `tsconfig.json` 생성

**신규 파일:**

- `packages/design-system/package.json`
- `packages/design-system/vite.config.ts`
- `packages/design-system/tsconfig.json`

---

### Phase 3: 디자인 토큰 마이그레이션

**작업 내용:**

1. `tokens/colors.ts` - JS/TS 토큰 생성
2. `tokens/colors.scss` - SCSS 변수 생성
3. `tokens/typography.ts` - JS/TS 토큰 생성
4. `tokens/typography.scss` - SCSS 변수 생성
5. `tokens/index.ts` - 배럴 파일

**원본 → 대상:**

- `src/styles/color.module.scss` → `packages/design-system/src/tokens/colors.scss`
- `src/styles/text.module.scss` → `packages/design-system/src/tokens/typography.scss`

---

### Phase 4: 컴포넌트 마이그레이션

**각 컴포넌트에 대해:**

1. `.tsx` 파일 이전 (타입 개선, HTML 속성 확장)
2. `.module.scss` 파일 이전 (경로 수정)
3. `index.ts` 배럴 파일 생성
4. `.stories.tsx` 파일 생성

**원본 → 대상:**

- `src/components/Button/` → `packages/design-system/src/components/Button/`
- `src/components/Typography/` → `packages/design-system/src/components/Typography/`
- `src/components/Loading/` → `packages/design-system/src/components/Loading/`
- `src/components/LazyLoadImage/` → `packages/design-system/src/components/LazyLoadImage/`

---

### Phase 5: Storybook 설정

**작업 내용:**

1. Storybook 의존성 설치
2. `.storybook/main.ts` 설정
3. `.storybook/preview.ts` 설정
4. 각 컴포넌트 stories 파일 작성

**신규 파일:**

- `packages/design-system/.storybook/main.ts`
- `packages/design-system/.storybook/preview.ts`
- 각 컴포넌트 폴더 내 `*.stories.tsx`

---

### Phase 6: 빌드 검증

**작업 내용:**

1. `pnpm build` 실행 (Turborepo가 의존성 순서대로 빌드)
2. dist 출력 확인
   - `dist/index.js` (ESM)
   - `dist/index.cjs` (CJS)
   - `dist/index.d.ts` (타입)
   - `dist/styles.css` (스타일)
3. Turborepo 캐싱 동작 확인

---

### Phase 7: alohapoke 앱 마이그레이션

**작업 내용:**

1. `apps/web/package.json`에 의존성 추가: `"@mydav/design-system": "workspace:*"`
2. import 문 변경
3. 분리된 컴포넌트 원본 파일 삭제

**수정 파일:**

- `apps/web/src/components/Header/Header.tsx`
- `apps/web/src/components/Header/RecentView.tsx`
- `apps/web/src/pages/MainList/MainList.tsx`
- `apps/web/src/pages/MainList/ui/PokemonList.tsx`
- `apps/web/src/pages/DetailPage/DetailPage.tsx`
- `apps/web/src/pages/DetailPage/ui/PokemonImages.tsx`
- `apps/web/src/pages/DetailPage/ui/PokemonIntro.tsx`
- `apps/web/src/pages/DetailPage/ui/PokemonStats.tsx`
- `apps/web/src/pages/ErrorPage/ErrorPage.tsx`

---

### Phase 8: npm 배포

**작업 내용:**

1. npm 로그인 (`npm login`)
2. 배포 테스트 (`npm publish --dry-run`)
3. 실제 배포 (`npm publish --access public`)

---

## 주요 설정 파일

### 루트 package.json

```json
{
  "name": "alohapoke-monorepo",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "storybook": "turbo storybook"
  },
  "devDependencies": {
    "turbo": "^2.3.0"
  },
  "packageManager": "pnpm@10.26.2"
}
```

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "storybook": {
      "cache": false,
      "persistent": true
    },
    "build-storybook": {
      "dependsOn": ["^build"],
      "outputs": ["storybook-static/**"]
    }
  }
}
```

### packages/design-system/package.json

```json
{
  "name": "@mydav/design-system",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./styles": "./dist/styles.css",
    "./tokens": {
      "import": "./dist/tokens/index.js",
      "require": "./dist/tokens/index.cjs"
    },
    "./tokens/scss": "./dist/tokens/variables.scss"
  },
  "files": ["dist"],
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "dependencies": {
    "classnames": "^2.5.1"
  },
  "devDependencies": {
    "@storybook/react": "^8.4.0",
    "@storybook/react-vite": "^8.4.0",
    "@types/react": "^18.3.2",
    "@vitejs/plugin-react": "^4.3.4",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "sass": "^1.77.4",
    "storybook": "^8.4.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0",
    "vite-plugin-dts": "^4.3.0"
  },
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

### packages/design-system/vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src"],
      outDir: "dist",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
      generateScopedName: "mydav-[local]-[hash:base64:5]",
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "styles.css";
          return assetInfo.name || "assets/[name][extname]";
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
});
```

---

## 사용 예시 (배포 후)

```typescript
// 컴포넌트 사용
import { Button, Typography, Loading, LazyLoadImage } from '@mydav/design-system';
import '@mydav/design-system/styles';

// 토큰 사용 (JS)
import { colors, typography } from '@mydav/design-system/tokens';

// 토큰 사용 (SCSS)
@use '@mydav/design-system/tokens/scss' as tokens;
```

---

## 컴포넌트 API

### Button

```typescript
interface ButtonProps {
  size?: "small" | "medium" | "massive";
  color?: "primary" | "error";
  children?: React.ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}
```

### Typography

```typescript
interface TypographyProps {
  size: "t1" | "t2" | "t3" | "t4";
  as?: React.ElementType;
  children?: React.ReactNode;
}
```

### Loading

```typescript
interface LoadingProps {
  size?: "small" | "medium";
}
```

### LazyLoadImage

```typescript
interface LazyLoadImageProps {
  imageSource: string;
  alt?: string;
}
```

---

## 디자인 토큰

### Colors

```typescript
const colors = {
  primary: { light: "#71b3ff", main: "#3196ef", dark: "#0062b7" },
  error: { light: "#f3869d", main: "#ec3a5d", dark: "#c5082f" },
  common: { white: "#fff", black: "#000", grey: "#727274" },
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
