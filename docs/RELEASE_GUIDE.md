# Release Guide

@mydav/design-system 패키지 배포 가이드

## 배포 방식 비교

| 항목 | pnpm version | release-it |
|------|--------------|------------|
| 버전 업데이트 | 수동 (`pnpm version patch`) | 자동 (인터랙티브 선택) |
| CHANGELOG 생성 | 수동 작성 필요 | 자동 생성 (Conventional Commits) |
| git commit | 자동 | 자동 |
| git tag | 자동 | 자동 |
| GitHub Release | 수동 (`gh release create`) | 자동 |
| npm publish | 수동 (`pnpm publish`) | 자동 |
| 빌드 | 수동 (`pnpm build`) | 자동 (hooks) |

## release-it 사용법 (권장)

### 기본 명령어

```bash
cd packages/design-system

# 인터랙티브 릴리스 (버전 선택 UI)
pnpm release

# 버전 지정 릴리스
pnpm release:patch   # 버그 수정: 0.1.0 → 0.1.1
pnpm release:minor   # 기능 추가: 0.1.0 → 0.2.0
pnpm release:major   # Breaking changes: 0.1.0 → 1.0.0

# 테스트 (실제 배포 없이 시뮬레이션)
pnpm release --dry-run

# Canary 배포 (테스트용 프리릴리스)
pnpm release --preRelease=canary
```

### Canary 배포

정식 릴리스 전 테스트용 프리릴리스 버전입니다.

```bash
# 0.1.0 → 0.1.1-canary.0
# 0.1.1-canary.0 → 0.1.1-canary.1
pnpm release --preRelease=canary
```

- npm에 `canary` 태그로 배포됩니다
- 기본 `npm install`로는 설치되지 않습니다
- 명시적으로 태그를 지정해야 설치됩니다:

```bash
npm install @mydav/design-system@canary
```

### 자동 수행 작업

`pnpm release` 실행 시 다음이 순차적으로 수행됩니다:

1. **빌드** - `pnpm build` 실행
2. **버전 업데이트** - `package.json`의 `version` 필드 수정
3. **CHANGELOG 생성** - Conventional Commits 기반으로 변경 내역 자동 분류
4. **git commit** - `release: @mydav/design-system v{version}` 메시지로 커밋
5. **git tag** - `@mydav/design-system@{version}` 태그 생성
6. **git push** - 커밋과 태그를 원격 저장소에 푸시
7. **GitHub Release** - 릴리스 노트와 함께 GitHub Release 생성
8. **npm publish** - npm 레지스트리에 패키지 배포

### Conventional Commits

CHANGELOG가 자동 분류되려면 커밋 메시지를 Conventional Commits 형식으로 작성해야 합니다:

```
<type>: <description>

[optional body]
```

| Type | 설명 | CHANGELOG 섹션 |
|------|------|----------------|
| `feat` | 새로운 기능 | Features |
| `fix` | 버그 수정 | Bug Fixes |
| `docs` | 문서 변경 | Documentation |
| `style` | 코드 스타일 (포맷팅 등) | Styles |
| `refactor` | 리팩토링 | Code Refactoring |
| `perf` | 성능 개선 | Performance Improvements |
| `test` | 테스트 추가/수정 | Tests |
| `build` | 빌드 시스템 변경 | Build System |
| `ci` | CI 설정 변경 | CI |
| `chore` | 기타 변경 | (숨김) |

**예시:**
```bash
git commit -m "feat: Button 컴포넌트에 loading 상태 추가"
git commit -m "fix: Typography line-height 계산 오류 수정"
git commit -m "docs: README에 사용 예시 추가"
```

### 설정 파일

`.release-it.json`:
```json
{
  "git": {
    "commitMessage": "release: @mydav/design-system v${version}",
    "tagName": "@mydav/design-system@${version}",
    "requireBranch": "main"
  },
  "github": {
    "release": true
  },
  "npm": {
    "publish": true
  },
  "plugins": {
    "@release-it/conventional-changelog": {
      "preset": "conventionalcommits",
      "infile": "CHANGELOG.md"
    }
  },
  "hooks": {
    "before:init": ["pnpm build"]
  }
}
```

---

## pnpm version 사용법 (수동)

release-it 없이 수동으로 배포하는 방법입니다.

### 명령어

```bash
cd packages/design-system

# 1. 빌드
pnpm build

# 2. 버전 업데이트 + commit + tag
pnpm version patch -m "release: @mydav/design-system v%s"
# 또는
pnpm version minor -m "release: @mydav/design-system v%s"
# 또는
pnpm version major -m "release: @mydav/design-system v%s"

# 3. 푸시
git push && git push --tags

# 4. npm 배포
pnpm publish

# 5. GitHub Release 생성 (선택)
gh release create @mydav/design-system@0.1.1 --generate-notes
```

### pnpm version이 수행하는 작업

1. `package.json`의 `version` 필드 업데이트
2. git commit 생성 (`-m` 옵션의 메시지 사용, `%s`는 버전으로 치환)
3. git tag 생성 (v0.1.1 형식)

### Canary 배포

테스트용 프리릴리스 버전:

```bash
pnpm version prerelease --preid=canary -m "release: @mydav/design-system v%s"
pnpm publish --tag canary
```

설치 시:
```bash
npm install @mydav/design-system@canary
```

---

## 버전 규칙 (Semantic Versioning)

`MAJOR.MINOR.PATCH` 형식을 따릅니다.

| 변경 유형 | 버전 증가 | 예시 |
|-----------|-----------|------|
| Breaking changes (호환성 깨짐) | MAJOR | 1.0.0 → 2.0.0 |
| 새로운 기능 (하위 호환) | MINOR | 1.0.0 → 1.1.0 |
| 버그 수정 | PATCH | 1.0.0 → 1.0.1 |
| 프리릴리스 | - | 1.0.0 → 1.0.1-canary.0 |

**Breaking changes 예시:**
- 컴포넌트 props 이름 변경
- 필수 props 추가
- 기존 기능 제거
- 동작 방식 변경

---

## 체크리스트

배포 전 확인사항:

- [ ] main 브랜치에서 작업 중인가?
- [ ] 워킹 디렉토리가 clean한가? (`git status`)
- [ ] 모든 테스트가 통과하는가?
- [ ] 빌드가 성공하는가? (`pnpm build`)
- [ ] Conventional Commits 형식을 사용했는가?
- [ ] npm 로그인이 되어 있는가? (`npm whoami`)
- [ ] GitHub 토큰이 설정되어 있는가? (`gh auth status`)
