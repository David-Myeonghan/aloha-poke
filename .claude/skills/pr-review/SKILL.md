---
name: pr-review
description: PR 생성, 리뷰, 코멘트 작성을 자동화합니다. "PR 만들어줘", "PR 리뷰해줘", "/pr-review" 명령으로 실행합니다.
---

# PR Review Skill

현재 브랜치에서 PR을 생성하고, 변경사항을 리뷰한 후 코멘트를 작성합니다.

## 사용법

```
/pr-review
```

또는 자연어로:
- "PR 만들고 리뷰해줘"
- "현재 브랜치로 PR 생성하고 코멘트 달아줘"

## 워크플로우

### 1. PR 생성

```bash
# 현재 브랜치 확인
git branch --show-current

# 리모트에 푸시
git push -u origin <branch-name>

# PR 생성
gh pr create --title "<제목>" --body "<본문>"
```

PR 본문 템플릿:
```markdown
## Summary
- 변경사항 요약 (bullet points)

## Changes
- 주요 변경 내용

## Test plan
- [ ] 테스트 항목

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### 2. PR 리뷰

```bash
# PR 정보 확인
gh pr view <pr-number> --json title,body,additions,deletions,changedFiles

# 변경 파일 목록
gh pr diff <pr-number> --name-only

# 상세 diff 확인
gh pr diff <pr-number>
```

리뷰 시 확인 사항:
- 코드 품질 및 가독성
- 보안 취약점
- 테스트 커버리지
- 문서화 여부
- 성능 영향

### 3. 리뷰 코멘트 작성

```bash
gh pr comment <pr-number> --body "<리뷰 내용>"
```

코멘트 템플릿:
```markdown
## 🔍 PR Review

### 개요
[변경사항 요약]

| 항목 | 내용 |
|------|------|
| 변경 파일 | X개 |
| 추가 라인 | +X |
| 삭제 라인 | -X |

---

### ✅ 잘된 점
- [긍정적인 피드백]

### 📝 확인 사항
- [x] 체크리스트

### 💡 개선 제안 (Optional)
- [선택적 개선사항]

---

**LGTM! 🚀** / **수정 필요**
```

## 전체 명령어 요약

```bash
# 1. PR 생성
git push -u origin $(git branch --show-current)
gh pr create --title "feat: ..." --body "..."

# 2. PR 정보 조회
gh pr view <pr-number> --json title,body,additions,deletions,changedFiles

# 3. 리뷰 코멘트
gh pr comment <pr-number> --body "..."

# 4. PR 머지
gh pr merge <pr-number> --squash --delete-branch
```
