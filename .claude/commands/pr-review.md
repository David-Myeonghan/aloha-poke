# PR Review Command

현재 브랜치에서 PR을 생성하고, 리뷰 후 코멘트를 작성합니다.

## 실행 단계

### 1. PR 생성

```bash
# 브랜치 푸시
git push -u origin $(git branch --show-current)

# PR 생성
gh pr create --title "<제목>" --body "## Summary
- 변경사항 요약

## Changes
- 주요 변경 내용

## Test plan
- [ ] 테스트 항목

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

### 2. PR 리뷰

```bash
# PR 정보 확인
gh pr view <pr-number> --json title,body,additions,deletions,changedFiles

# 변경 파일 목록
gh pr diff <pr-number> --name-only
```

### 3. 리뷰 코멘트 작성

```bash
gh pr comment <pr-number> --body "## 🔍 PR Review

### 개요
[변경사항 요약]

| 항목 | 내용 |
|------|------|
| 변경 파일 | X개 |
| 추가 라인 | +X |
| 삭제 라인 | -X |

### ✅ 잘된 점
- [피드백]

### 📝 확인 사항
- [x] 체크리스트

**LGTM! 🚀**"
```

## 인자

- `$ARGUMENTS`: PR 번호 (선택사항). 없으면 새 PR 생성
