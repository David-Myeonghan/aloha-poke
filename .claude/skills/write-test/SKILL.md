---
name: write-test
description: 컴포넌트에 대한 Jest 테스트를 작성합니다. "테스트 작성해줘", "테스트 만들어줘" 등의 자연어로 실행합니다.
---

# Write Test Skill

컴포넌트에 대한 Jest + React Testing Library 테스트를 작성합니다.

## 트리거

자연어로 호출:
- "테스트 작성해줘"
- "테스트 만들어줘"
- "이 컴포넌트 테스트해줘"
- "Button 테스트 추가해줘"

자동 트리거 조건:
- 새 컴포넌트 파일 생성 시
- 기존 컴포넌트 수정 후 테스트 없을 때

---

## 실행 방식

**IMPORTANT**: 이 skill은 Task 도구를 사용하여 `general-purpose` subagent로 실행합니다.

```
Task({
  subagent_type: "general-purpose",
  description: "Write component tests",
  prompt: `
    다음 파일에 대한 Jest 테스트를 작성해줘: <component-path>

    반드시 packages/design-system/docs/testing.md를 먼저 읽고 가이드라인을 따라야 합니다.

    테스트 작성 후 pnpm test로 실행해서 통과 확인해줘.
  `
})
```

---

## 테스트 가이드

반드시 참조: `packages/design-system/docs/testing.md`

---

## 실행 단계

### Step 1: 컴포넌트 분석

컴포넌트 파일을 읽고 분석:

1. **Props** - 필수/선택, 타입, 기본값
2. **이벤트** - onClick, onChange, onLoad 등
3. **상태** - disabled, loading, error 등
4. **접근성** - role, aria-* 속성

### Step 2: 테스트 범위 결정

| 유형 | 예시 | 필수 |
|------|------|------|
| 렌더링 | children 표시 | O |
| 이벤트 | onClick 호출 | O |
| 상태 | disabled 동작 | O |
| 접근성 | role 검증 | O |
| HTML 속성 | aria-label 전달 | O |

### Step 3: 테스트 작성

#### AAA 패턴

```tsx
it('설명', async () => {
  // Arrange
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);

  // Act
  await user.click(screen.getByRole('button'));

  // Assert
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

#### 쿼리 우선순위

```tsx
// 1순위: 접근성 쿼리
screen.getByRole('button');
screen.getByLabelText('Submit');

// 2순위: 텍스트 기반
screen.getByText('Click me');
screen.getByAltText('Image');

// 3순위: testId (최후 수단)
screen.getByTestId('loading');
```

#### userEvent vs fireEvent

```tsx
// userEvent: 사용자 인터랙션
const user = userEvent.setup();
await user.click(button);

// fireEvent: 브라우저 이벤트 (load, error 등)
fireEvent.load(img);
fireEvent.error(img);
```

### Step 4: 테스트하지 않을 것

```tsx
// CSS 클래스 - Chromatic에서 담당
expect(button).toHaveClass('primary'); // X

// 스타일 속성 - Chromatic에서 담당
expect(button).toHaveStyle({ color: 'white' }); // X
```

### Step 5: 테스트 실행

```bash
pnpm test <component>.test.tsx
pnpm test:coverage
```

---

## 관련 문서

- `packages/design-system/docs/testing.md` - 테스트 전략 문서
