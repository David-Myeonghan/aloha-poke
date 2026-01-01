# 테스트 전략

@mydav/design-system의 테스트 역할 분담 및 가이드

## 테스트 역할 분담

| 도구 | 역할 | 검증 대상 |
|------|------|-----------|
| **Jest + RTL** | 단위 테스트 | 동작, 인터랙션, 접근성 |
| **Chromatic** | 시각적 회귀 테스트 | 스타일, 레이아웃, 디자인 |
| **Storybook** | 컴포넌트 문서화 | 사용 예시, props 조합 |

## Jest 테스트 범위

### ✅ 테스트할 것 (동작)

```tsx
// 1. 렌더링
it('renders children correctly', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

// 2. 이벤트 핸들링
it('calls onClick when clicked', async () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  await user.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

// 3. 상태 변화 (disabled 등)
it('is disabled when disabled prop is true', () => {
  render(<Button disabled>Disabled</Button>);
  expect(screen.getByRole('button')).toBeDisabled();
});

// 4. HTML 속성 전달
it('passes through HTML attributes', () => {
  render(<Button type="submit" aria-label="Submit">Submit</Button>);
  expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
});

// 5. 접근성
it('has accessible role', () => {
  render(<Button>Click</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

### ❌ 테스트하지 않을 것 (스타일)

```tsx
// CSS 클래스 검증 - Chromatic에서 담당
expect(button).toHaveClass('small');  // ❌
expect(button).toHaveClass('primary'); // ❌

// 스타일 속성 검증 - Chromatic에서 담당
expect(button).toHaveStyle({ color: 'white' }); // ❌
```

**이유:**
1. CSS 클래스명은 구현 세부사항
2. 클래스가 적용되어도 실제 스타일이 올바른지 보장 못함
3. Chromatic이 실제 렌더링 결과를 스크린샷으로 검증

## Chromatic 테스트 범위

Chromatic은 Storybook의 각 스토리를 스크린샷으로 캡처하여 시각적 변경을 감지합니다.

### 검증 대상

- `size` prop에 따른 크기 변화
- `color` prop에 따른 색상 변화
- hover, focus, active 상태 스타일
- 레이아웃 및 간격
- 반응형 동작

### 설정

```yaml
# .github/workflows/chromatic.yml
- uses: chromaui/action@latest
  with:
    projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

## 실행 명령어

```bash
# 단위 테스트
pnpm test              # 실행
pnpm test:watch        # 워치 모드
pnpm test:coverage     # 커버리지 리포트

# 시각적 테스트
pnpm chromatic         # Chromatic에 업로드
```

## 테스트 작성 가이드

### 1. userEvent 사용

```tsx
// ✅ 권장: userEvent (실제 사용자 동작 시뮬레이션)
const user = userEvent.setup();
await user.click(button);

// ❌ 비권장: fireEvent (저수준 DOM 이벤트)
fireEvent.click(button);
```

### 2. 접근성 쿼리 우선

```tsx
// ✅ 권장: role, label 기반 쿼리
screen.getByRole('button');
screen.getByLabelText('Submit');

// ⚠️ 필요시: testId (시맨틱 요소가 없을 때)
screen.getByTestId('loading');
```

### 3. AAA 패턴

```tsx
it('calls onClick when clicked', async () => {
  // Arrange
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);

  // Act
  await user.click(screen.getByRole('button'));

  // Assert
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## 파일 구조

```
packages/design-system/
├── jest.config.ts          # Jest 설정
├── jest.setup.ts           # 테스트 셋업 (@testing-library/jest-dom)
├── jest.d.ts               # Jest 타입 선언
└── src/
    └── components/
        ├── Button/
        │   ├── Button.tsx
        │   ├── Button.test.tsx    # 단위 테스트
        │   └── Button.stories.tsx # Storybook (Chromatic용)
        └── ...
```

## 참고 자료

- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles)
- [React Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Chromatic Documentation](https://www.chromatic.com/docs/)
