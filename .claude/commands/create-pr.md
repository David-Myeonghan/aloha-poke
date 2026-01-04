---
description: PR 생성 및 코드 리뷰
argument-hint: [pr-number]
---

# PR Review Command

현재 브랜치에서 PR을 생성하고, 코드 리뷰 후 코멘트를 작성합니다.

## 사용법

```
/pr-review          # 새 PR 생성 + 리뷰
/pr-review <number> # 기존 PR 리뷰
```

---

## 리뷰 기준

상세 리뷰 영역, 피드백 분류, 코멘트 형식은 [pr-review-criteria.md](../shared/pr-review-criteria.md) 참고

---

## 실행 단계

### Step 1: 현재 상태 확인 (새 PR 생성 시)

$ARGUMENTS가 없으면 새 PR 생성 모드:

```bash
# 현재 브랜치 및 상태 확인
git status
git branch --show-current

# main 브랜치 대비 커밋 확인
git log main..HEAD --oneline

# 변경 사항 확인
git diff main..HEAD --stat
```

### Step 2: 브랜치 푸시 및 PR 생성 (새 PR 생성 시)

```bash
# 리모트에 브랜치 푸시
git push -u origin <현재-브랜치명>

# PR 생성
gh pr create --title "<PR 제목>" --body "<PR 본문>"
```

PR 본문에 포함:

- 변경 사항 요약
- 관련 이슈 (있으면 `Closes #N`)

### Step 3: PR 정보 수집 (기존 PR 리뷰 시)

```bash
# PR 메타데이터
gh pr view $ARGUMENTS --json title,body,additions,deletions,changedFiles,commits

# 변경 파일 목록
gh pr diff $ARGUMENTS --name-only

# 주요 파일 diff 확인 (필요시)
gh pr diff $ARGUMENTS
```

### Step 4: 코드 분석

변경된 파일을 읽고 6가지 리뷰 영역에 따라 분석합니다.

### Step 5: 리뷰 코멘트 작성

```bash
gh pr comment $ARGUMENTS --body "<리뷰 내용>"
```

---

## 인자

- `$ARGUMENTS`: PR 번호. 없으면 현재 브랜치에서 새 PR 생성
