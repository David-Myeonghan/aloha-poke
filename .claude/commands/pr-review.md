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

### Step 1: PR 정보 수집

```bash
# PR 메타데이터
gh pr view $ARGUMENTS --json title,body,additions,deletions,changedFiles,commits

# 변경 파일 목록
gh pr diff $ARGUMENTS --name-only

# 주요 파일 diff 확인 (필요시)
gh pr diff $ARGUMENTS
```

### Step 2: 코드 분석

변경된 파일을 읽고 6가지 리뷰 영역에 따라 분석합니다.

### Step 3: 리뷰 코멘트 작성

```bash
gh pr comment $ARGUMENTS --body "<리뷰 내용>"
```

---

## 인자

- `$ARGUMENTS`: PR 번호. 없으면 현재 브랜치에서 새 PR 생성
