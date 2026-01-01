# Aloha Poke Monorepo

포켓몬 도감 웹 앱과 디자인 시스템을 포함한 모노레포

## 프로젝트 구조

```
alohapoke/
├── apps/
│   └── web/                    # 포켓몬 도감 웹 앱
├── packages/
│   └── design-system/          # @mydav/design-system (npm 배포)
├── docs/                       # 프로젝트 문서
├── .claude/                    # Claude Code 커맨드/스킬
├── .github/                    # GitHub Actions
├── turbo.json                  # Turborepo 설정
└── pnpm-workspace.yaml         # pnpm 워크스페이스
```

## 구성

### Apps (애플리케이션)

| 앱      | 설명              | 경로       |
| ------- | ----------------- | ---------- |
| **web** | 포켓몬 도감 웹 앱 | `apps/web` |

### Packages (라이브러리)

| 패키지                   | 설명                         | npm                                                        |
| ------------------------ | ---------------------------- | ---------------------------------------------------------- |
| **@mydav/design-system** | React 컴포넌트 디자인 시스템 | [Link](https://www.npmjs.com/package/@mydav/design-system) |

## 기술 스택

### 공통

- **패키지 매니저**: pnpm (워크스페이스)
- **빌드 시스템**: Turborepo
- **언어**: TypeScript

### apps/web

- React 18 + Vite
- React Query (서버 상태 관리)
- React Router v6
- IndexedDB (로컬 저장)
- SCSS Modules

### packages/design-system

- React 18 + Vite (라이브러리 모드)
- Storybook (컴포넌트 문서화)
- Chromatic (시각적 회귀 테스트)
- SCSS Modules + CSS 커스텀 프로퍼티

## 시작하기

### 설치

```bash
# 의존성 설치
pnpm install
```

### 개발

```bash
# 전체 개발 서버 실행 (Turborepo)
pnpm dev

# 개별 패키지 실행
pnpm --filter @alohapoke/web dev
pnpm --filter @mydav/design-system storybook
```

### 빌드

```bash
# 전체 빌드
pnpm build

# 개별 패키지 빌드
pnpm --filter @mydav/design-system build
pnpm --filter @alohapoke/web build
```

## CI/CD (GitHub Actions)

| Workflow | 트리거 | 설명 |
|----------|--------|------|
| **Chromatic** | `packages/design-system/**` 변경 시 | Storybook 배포 + 시각적 회귀 테스트 |

### Chromatic Workflow

- **Push to main**: Chromatic에 Storybook 자동 배포
- **Pull Request**: 시각적 변경 감지 + PR 코멘트로 배포 URL 제공

필요한 Secrets:
- `CHROMATIC_PROJECT_TOKEN`: Chromatic 프로젝트 토큰

## Claude Code 커맨드

| 커맨드                   | 설명                             |
| ------------------------ | -------------------------------- |
| `/issue-branch <number>` | 이슈에서 브랜치 생성 및 체크아웃 |
| `/pr-review [number]`    | PR 생성 및 코드 리뷰             |

## 디자인 시스템 사용

```bash
# 설치 (외부 프로젝트에서)
npm install @mydav/design-system
```

```tsx
import { Button, Typography } from "@mydav/design-system";
import "@mydav/design-system/styles";

<Button size="medium" color="primary">
  Click me
</Button>;
```

자세한 내용은 [design-system README](./packages/design-system/README.md) 참고

## 문서

- [IndexedDB 정리](./docs/IndexedDB.md)
- [디자인 시스템 컴포넌트](./packages/design-system/docs/components.md)
- [디자인 토큰](./packages/design-system/docs/design-tokens.md)
- [FAQ](./packages/design-system/docs/faq.md)

## 라이선스

MIT
