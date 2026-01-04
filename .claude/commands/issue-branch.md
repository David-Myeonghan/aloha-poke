---
description: GitHub 이슈에서 브랜치 생성
argument-hint: <issue-number>
---

# Issue Branch Command

GitHub 이슈에서 브랜치를 생성하고 체크아웃합니다.

## 사용법

```
/issue-branch <issue-number>
```

## 실행 단계

### Step 1: 이슈 정보 조회

```bash
gh issue view $ARGUMENTS --json number,title,labels
```

### Step 2: 브랜치명 생성

이슈 정보를 바탕으로 브랜치명을 생성합니다:

| 라벨          | 접두사   | 예시                         |
| ------------- | -------- | ---------------------------- |
| bug           | `fix/`   | `fix/issue-3-login-error`    |
| enhancement   | `feat/`  | `feat/issue-5-dark-mode`     |
| documentation | `docs/`  | `docs/issue-7-readme-update` |
| 기타/없음     | `issue/` | `issue/10-refactor`          |

브랜치명 규칙:

- 소문자 + 케밥케이스
- 이슈 번호 포함
- 제목에서 핵심 키워드 추출 (3-4단어)

### Step 3: 브랜치 생성 및 체크아웃

```bash
# main 브랜치 최신화
git checkout main && git pull origin main

# 브랜치 생성 및 체크아웃
git checkout -b <branch-name>
```

### Step 4: 작업 안내

브랜치 생성 후 안내:

- 현재 이슈: #N - 제목
- 생성된 브랜치: `<branch-name>`
- 작업 완료 후: `/pr-review` 실행하면 `Closes #N` 자동 포함

---

## 인자

- `$ARGUMENTS`: GitHub 이슈 번호 (필수)

---

## 관련 커맨드

- `/pr-review` - PR 생성 및 리뷰 (이슈 자동 연결)
