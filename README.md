# Aloha Poke

포켓몬 도감 웹 앱 - 최근 본 포켓몬을 IndexedDB에 저장하여 오프라인에서도 확인 가능

## 기술 스택

- React 18 + TypeScript
- Vite + pnpm
- React Query (서버 상태 관리)
- React Router v6
- IndexedDB (브라우저에 데이터 저장)
- SCSS Modules

## 주요 기능

- 포켓몬 목록 조회 및 검색
- 포켓몬 상세 정보 (스탯, 타입 등)
- 최근 본 포켓몬 로컬 저장 (IndexedDB)

## 실행 방법

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build
```

## 참고 문서

- [IndexedDB 정리](./docs/IndexedDB.md)
  EOF
