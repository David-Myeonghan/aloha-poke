# @mydav/design-system Jest 테스트 설정 계획

## 개요

packages/design-system에 Jest + React Testing Library를 추가하여 컴포넌트 단위 테스트 환경을 구축합니다.

## 현재 상태

- **컴포넌트**: Button, Typography, Loading, LazyLoadImage (4개)
- **문서화**: Storybook 설정 완료
- **테스트**: 없음

## 설치할 패키지

```bash
pnpm add -D jest @types/jest ts-jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom identity-obj-proxy
```

| 패키지 | 용도 |
|--------|------|
| jest | 테스트 러너 |
| @types/jest | Jest 타입 정의 |
| ts-jest | TypeScript 지원 |
| jest-environment-jsdom | DOM 환경 시뮬레이션 |
| @testing-library/react | React 컴포넌트 테스트 유틸리티 |
| @testing-library/jest-dom | 커스텀 DOM 매처 (toBeInTheDocument 등) |
| identity-obj-proxy | CSS Modules mock |

---

## 구현 단계

### Step 1: Jest 설정 파일 생성

**파일**: `packages/design-system/jest.config.ts`

```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.module\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.tsx',
    '!src/**/index.ts',
  ],
};

export default config;
```

### Step 2: Jest 셋업 파일 생성

**파일**: `packages/design-system/jest.setup.ts`

```typescript
import '@testing-library/jest-dom';
```

### Step 3: package.json 스크립트 추가

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Step 4: turbo.json 업데이트

```json
{
  "tasks": {
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

### Step 5: 컴포넌트별 테스트 파일 작성

| 컴포넌트 | 테스트 파일 | 테스트 케이스 |
|----------|-------------|---------------|
| Button | `Button.test.tsx` | 렌더링, size/color props, onClick, disabled |
| Typography | `Typography.test.tsx` | 렌더링, size props, as prop (태그 변경) |
| Loading | `Loading.test.tsx` | 렌더링, size props |
| LazyLoadImage | `LazyLoadImage.test.tsx` | 렌더링, 이미지 로드 상태 |

---

## 파일 변경 목록

### 신규 파일
- `packages/design-system/jest.config.ts`
- `packages/design-system/jest.setup.ts`
- `packages/design-system/src/components/Button/Button.test.tsx`
- `packages/design-system/src/components/Typography/Typography.test.tsx`
- `packages/design-system/src/components/Loading/Loading.test.tsx`
- `packages/design-system/src/components/LazyLoadImage/LazyLoadImage.test.tsx`

### 수정 파일
- `packages/design-system/package.json` (스크립트 + devDependencies)
- `turbo.json` (test 태스크 추가)

---

## 테스트 예시 (Button)

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies size class correctly', () => {
    render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('small');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## 실행 방법

```bash
cd packages/design-system

# 단일 실행
pnpm test

# Watch 모드
pnpm test:watch

# 커버리지 리포트
pnpm test:coverage

# 루트에서 Turbo로 실행
pnpm --filter @mydav/design-system test
```
