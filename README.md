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
├── .claude/
│   ├── commands/               # 슬래시 커맨드 (/pr-review, /issue-branch)
│   ├── skills/                 # 자연어 스킬
│   └── shared/                 # 공통 리소스 (리뷰 기준 등)
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
- Jest + React Testing Library (단위 테스트)
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

### npm 배포 (@mydav/design-system)

[release-it](https://github.com/release-it/release-it)을 사용하여 배포합니다.

```bash
cd packages/design-system

pnpm release         # 인터랙티브 (버전 선택)
pnpm release:patch   # 버그 수정: 0.1.0 → 0.1.1
pnpm release:minor   # 기능 추가: 0.1.0 → 0.2.0
pnpm release:major   # Breaking changes: 0.1.0 → 1.0.0
```

자세한 내용은 [Release Guide](./docs/RELEASE_GUIDE.md) 참고

## CI/CD (GitHub Actions)

| Workflow      | 트리거                              | 설명                                |
| ------------- | ----------------------------------- | ----------------------------------- |
| **Chromatic** | `packages/design-system/**` 변경 시 | Storybook 배포 + 시각적 회귀 테스트 |

### Chromatic Workflow

- **Push to main**: Chromatic에 Storybook 자동 배포
- **Pull Request**: 시각적 변경 감지 + PR 코멘트로 배포 URL 제공

필요한 Secrets:

- `CHROMATIC_PROJECT_TOKEN`: Chromatic 프로젝트 토큰

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

## Claude Code 커맨드 & 스킬

이 프로젝트는 [Claude Code](https://platform.claude.com/docs/ko/agents-and-tools/agent-skills/overview) CLI 도구와 함께 사용할 수 있는 커스텀 커맨드와 스킬을 제공합니다.

### Commands vs Skills

| 구분         | 위치                | 호출 방식                   | 용도                        |
| ------------ | ------------------- | --------------------------- | --------------------------- |
| **Commands** | `.claude/commands/` | `/command` 형태로 직접 호출 | 정해진 워크플로우 순차 실행 |
| **Skills**   | `.claude/skills/`   | 자연어로 자동 인식          | 유연한 컨텍스트 기반 실행   |

`pr-review`는 두 가지 형태로 제공됩니다 (동일한 기능, 호출 방식만 다름):

- **Command**: `/pr-review` 명령어로 직접 호출
- **Skill**: "PR 만들어줘", "리뷰해줘" 같은 자연어로 자동 인식

### 스킬 목록

| 스킬           | 트리거 예시                    | 설명                          |
| -------------- | ------------------------------ | ----------------------------- |
| **pr-review**  | "PR 만들어줘", "리뷰해줘"      | PR 생성 및 코드 리뷰          |
| **write-test** | "테스트 작성해줘", "테스트 추가해줘" | Jest 테스트 작성 (testing.md 참조) |

### 커맨드 목록

| 커맨드                   | 설명                             |
| ------------------------ | -------------------------------- |
| `/issue-branch <number>` | 이슈에서 브랜치 생성 및 체크아웃 |
| `/pr-review [number]`    | PR 생성 및 코드 리뷰             |

### /issue-branch

GitHub 이슈 번호를 입력받아 적절한 브랜치를 생성하고 체크아웃합니다.

```bash
/issue-branch 3
```

- 이슈 라벨에 따라 브랜치 접두사 자동 결정 (`fix/`, `feat/`, `docs/`)
- main 브랜치 최신화 후 새 브랜치 생성
- 브랜치명: `<prefix>/issue-<number>-<keywords>`

### /pr-review

현재 브랜치에서 PR을 생성하거나 기존 PR을 리뷰합니다.

```bash
/pr-review      # 새 PR 생성 + 리뷰
/pr-review 5    # 기존 PR #5 리뷰
```

6가지 영역(보안, 성능, 코드 품질, 아키텍처, 에러 처리, 테스트/문서화)에 대해 코드 리뷰를 수행하고, 3단계 피드백(🔴 Critical, 🟡 Suggestion, ✅ Good)으로 분류합니다.

## 문서

### 프로젝트 기획/설계

- [기획 문서](./docs/PLANNING.md) - 프로젝트 개요 및 기획
- [화면 설계](./docs/SCREEN_SPEC.md) - 화면별 UI/UX 명세
- [API 명세](./docs/API_SPEC.md) - PokeAPI 사용 명세
- [컴포넌트 설계](./docs/COMPONENT_SPEC.md) - 컴포넌트 구조 설계
- [상태 관리](./docs/STATE_MANAGEMENT.md) - 상태 관리 전략

### 기술 문서

- [IndexedDB 정리](./docs/IndexedDB.md) - 로컬 저장소 구현
- [디자인 시스템 분리 계획](./docs/DESIGN_SYSTEM_PLAN.md) - 모노레포 분리 과정
- [Release Guide](./docs/RELEASE_GUIDE.md) - npm 배포 가이드 (release-it vs pnpm version)

### 디자인 시스템

- [컴포넌트 API](./packages/design-system/docs/components.md) - Button, Typography, Loading, LazyLoadImage
- [디자인 토큰](./packages/design-system/docs/design-tokens.md) - Colors, Typography 토큰
- [테스트 전략](./packages/design-system/docs/testing.md) - Jest vs Chromatic 역할 분담
- [모듈 해석](./packages/design-system/docs/module-resolution.md) - 빌드 설정
- [FAQ](./packages/design-system/docs/faq.md) - 자주 묻는 질문
