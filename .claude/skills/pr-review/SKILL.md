---
name: pr-review
description: PR 생성, 리뷰, 코멘트 작성을 자동화합니다. "PR 만들어줘", "PR 리뷰해줘", "코드 리뷰해줘" 등의 자연어로 실행합니다.
---

# PR Review Skill

현재 브랜치에서 PR을 생성하고, 코드 리뷰 후 코멘트를 작성합니다.

## 트리거

자연어로 호출:
- "PR 만들어줘"
- "PR 리뷰해줘"
- "코드 리뷰해줘"
- "현재 브랜치로 PR 생성하고 리뷰해줘"

---

## 리뷰 기준

상세 리뷰 영역, 피드백 분류, 코멘트 형식은 [pr-review-criteria.md](../../shared/pr-review-criteria.md) 참고

---

## 실행 단계

### Step 1: PR 정보 수집

```bash
# PR 메타데이터
gh pr view <pr-number> --json title,body,additions,deletions,changedFiles,commits

# 변경 파일 목록
gh pr diff <pr-number> --name-only

# 주요 파일 diff 확인 (필요시)
gh pr diff <pr-number>
```

### Step 2: 코드 분석

변경된 파일을 읽고 6가지 리뷰 영역에 따라 분석합니다.

### Step 3: 리뷰 코멘트 작성

```bash
gh pr comment <pr-number> --body "<리뷰 내용>"
```
