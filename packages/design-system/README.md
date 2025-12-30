# @mydav/design-system

React 컴포넌트 디자인 시스템 패키지

## 설치

```bash
pnpm add @mydav/design-system
```

## 사용법

```typescript
import { Button, Typography, Loading, LazyLoadImage } from '@mydav/design-system';
import '@mydav/design-system/styles';

function App() {
  return (
    <Button size="medium" color="primary">
      Click me
    </Button>
  );
}
```

## 문서

- [컴포넌트 API](./docs/components.md)
- [디자인 토큰](./docs/design-tokens.md)
- [모듈 해석](./docs/module-resolution.md)
