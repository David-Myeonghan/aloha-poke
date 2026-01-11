# Error Handling

React Suspense + ErrorBoundary 패턴을 사용한 선언적 에러 처리 구현 문서.

## 개요

```
useSuspenseQuery 실행
    ↓
API 실패 (404 Not Found)
    ↓
useSuspenseQuery가 에러를 throw
    ↓
ErrorBoundary가 catch
    ↓
fallback (NotFoundPage) 렌더링
    ↓
URL 변경 시 resetKeys 감지 → 에러 상태 리셋
```

## 관련 파일

| 파일                              | 역할                                |
| --------------------------------- | ----------------------------------- |
| `utils/routes/ErrorBoundary.tsx`  | 에러 catch 및 fallback 렌더링       |
| `utils/HOC/withAsyncBoundary.tsx` | Suspense + ErrorBoundary HOC        |
| `pages/NotFoundPage/`             | 포켓몬 검색 실패 시 표시되는 페이지 |
| `pages/DetailPage/DetailPage.tsx` | withAsyncBoundary 적용 예시         |

---

## ErrorBoundary

### 주요 Props

```tsx
interface ErrorBoundaryProps {
  fallback: ReactNode; // 에러 시 표시할 UI
  children: ReactNode; // 감싸는 컴포넌트
  resetKeys?: unknown[]; // 변경 시 에러 상태 리셋
}
```

### Lifecycle 메서드

#### getDerivedStateFromError

```tsx
// 에러 발생 시 → 상태 업데이트 (순수 함수)
static getDerivedStateFromError(error: Error): ErrorBoundaryState {
  return { hasError: true, error };
}
```

- **호출 시점**: 자식 컴포넌트에서 에러가 throw된 직후
- **용도**: 에러 상태를 설정하여 fallback UI 렌더링

#### componentDidCatch

```tsx
// 자식 컴포넌트에서 에러가 throw 된 후 호출
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  console.error("Uncaught error:", error, errorInfo);
}
```

- **호출 시점**: getDerivedStateFromError 이후
- **용도**: 에러 로깅, 에러 리포팅 서비스 전송 (Sentry 등)

#### componentDidUpdate

```tsx
/**
 * 리렌더링 완료 후 호출되는 lifecycle 메서드 (첫 렌더링 제외)
 * prevProps: React가 자동으로 전달하는 이전 props (리렌더링 전 상태)
 * this.props: 현재 props (리렌더링 후 상태)
 */
componentDidUpdate(prevProps: ErrorBoundaryProps) {
  // 에러 상태가 아니면 체크할 필요 없음 (early return 최적화)
  if (!this.state.hasError) return;

  // 이전 resetKeys와 현재 resetKeys 비교
  const prevKeys = prevProps.resetKeys ?? [];
  const currentKeys = this.props.resetKeys ?? [];

  // resetKeys 가 여러개로 늘어날 경우 대비
  const hasChanged = currentKeys.some(
    (key, index) => key !== prevKeys[index],
  );

  // 변경되었으면 에러 상태 초기화 → children 다시 렌더링
  if (hasChanged) {
    this.setState({ hasError: false, error: undefined });
  }
}
```

**호출되는 경우 (O)**
| 상황 | 설명 |
|------|------|
| props 변경 | 부모 컴포넌트가 리렌더링되어 props 전달 |
| state 변경 | `setState` 호출 |
| 같은 페이지 내 URL 변경 | `/detail?name=pikachu` → `/detail?name=bulbasaur` |

**호출되지 않는 경우 (X)**
| 상황 | 이유 |
|------|------|
| 첫 마운트 | 초기 렌더링은 update가 아님 |
| 다른 페이지로 이동 | 컴포넌트가 언마운트됨 (`componentWillUnmount` 호출) |

**예시: Back 버튼 클릭 시**

```
DetailPage에서 Back 버튼 클릭
    ↓
navigate(ROUTES.index) → 목록 페이지로 이동
    ↓
DetailPage + ErrorBoundary 언마운트
    ↓
componentWillUnmount 호출 (componentDidUpdate X)
```

**Early Return 최적화**

```tsx
if (!this.state.hasError) return;
```

- 정상 상태(`hasError: false`)일 때는 resetKeys 비교 로직 실행 안 함
- 함수 자체는 호출되지만, 불필요한 비교 연산 방지

- **용도**: resetKeys 변경 감지하여 에러 상태 리셋

---

## resetKeys 동작 원리

### 왜 필요한가?

ErrorBoundary는 한번 에러를 catch하면 **에러 상태를 유지**합니다.
URL이 변경되어도 에러 상태가 유지되기 때문에, 새로운 검색을 해도 NotFoundPage가 계속 표시됩니다.

### 동작 예시

```
1. "없는포켓몬" 검색 → API 에러 → hasError: true → NotFoundPage 표시

2. "pikachu" 검색 → URL 변경
   ↓
   componentDidUpdate 호출
   ↓
   prevKeys: ["?name=없는포켓몬"]
   currentKeys: ["?name=pikachu"]
   ↓
   hasChanged: true
   ↓
   setState({ hasError: false })
   ↓
   ErrorBoundary 리셋 → children 다시 렌더링 → 새 API 호출
```

### 비교 로직

```tsx
const hasChanged = currentKeys.some((key, index) => key !== prevKeys[index]);
```

- 배열의 각 요소를 **인덱스별로 비교**
- 하나라도 다르면 `true` 반환 (early return으로 효율적)
- resetKeys가 여러 개일 경우 대비

---

## withAsyncBoundary HOC

### 구조

```tsx
export default function withAsyncBoundary<Props>(
  WrappedComponent: ComponentType<Props>,
  { pendingFallback, rejectedFallback }: AsyncBoundaryProps = {},
) {
  return (props: Props) => {
    const location = useLocation();

    return (
      // 에러 UI
      <ErrorBoundary fallback={rejectedFallback} resetKeys={[location.search]}>
        {/* 로딩 UI */}
        <Suspense fallback={pendingFallback}>
          {/* 비즈니스 로직 (+ 데이터 fetching) */}
          <WrappedComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}
```

### 관심사 분리

| 역할            | 담당               |
| --------------- | ------------------ |
| 데이터 fetching | `useSuspenseQuery` |
| 로딩 UI         | `Suspense`         |
| 에러 UI         | `ErrorBoundary`    |
| 비즈니스 로직   | `WrappedComponent` |

---

## 사용 예시

### DetailPage

```tsx
function DetailPage() {
  const { data } = usePokemonDetail(paramName ?? "");

  // 성공 케이스만 처리 (에러/로딩은 HOC에서 처리)
  return <Content data={data} />;
}

export default withAsyncBoundary(withAddRecentPokemon(DetailPage), {
  rejectedFallback: <NotFoundPage />,
});
```

### 명령형 vs 선언적 비교

```tsx
// ❌ 명령형 (각 컴포넌트에서 처리)
function DetailPage() {
  const { data, error, isLoading } = useQuery(...);

  if (isLoading) return <Loading />;
  if (error) return <NotFoundPage />;
  return <Content data={data} />;
}

// ✅ 선언적 (HOC에서 일괄 처리)
function DetailPage() {
  const { data } = useSuspenseQuery(...);
  return <Content data={data} />;
}
export default withAsyncBoundary(DetailPage, {
  rejectedFallback: <NotFoundPage />
});
```

---

## 대안: QueryErrorResetBoundary

React Query에서 제공하는 에러 리셋 컴포넌트. "다시 시도" 버튼이 필요할 때 사용.

```tsx
import { QueryErrorResetBoundary } from "@tanstack/react-query";

<QueryErrorResetBoundary>
  {({ reset }) => (
    <ErrorBoundary
      onReset={reset}
      fallback={({ resetErrorBoundary }) => (
        <div>
          <p>에러 발생</p>
          <button onClick={resetErrorBoundary}>다시 시도</button>
        </div>
      )}
    >
      <DetailPage />
    </ErrorBoundary>
  )}
</QueryErrorResetBoundary>;
```

### resetKeys vs QueryErrorResetBoundary

| 방법                      | 용도                                            |
| ------------------------- | ----------------------------------------------- |
| `resetKeys`               | URL 등 값 변경 시 **자동** 리셋                 |
| `QueryErrorResetBoundary` | 사용자가 "다시 시도" 버튼 클릭 시 **수동** 리셋 |

현재 구현은 URL 변경 시 자동 리셋이 필요하므로 `resetKeys` 사용.

---

## useQuery vs useSuspenseQuery + HOC

### useQuery (HOC 없음)

```tsx
function DetailPage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["pokemon", paramName],
    queryFn: () => getPokemonDetail(paramName),
  });

  if (isLoading) return <Loading />;
  if (error) return <NotFoundPage />;
  return <Content data={data} />;
}
```

**동작:**

- URL 변경 → useQuery가 자동으로 refetch
- ErrorBoundary 없음 → resetKeys 불필요
- 각 컴포넌트에서 로딩/에러 상태 직접 처리

### useSuspenseQuery + HOC

```tsx
function DetailPage() {
  const { data } = useSuspenseQuery({
    queryKey: ["pokemon", paramName],
    queryFn: () => getPokemonDetail(paramName),
  });

  // 성공 케이스만 처리
  return <Content data={data} />;
}

export default withAsyncBoundary(DetailPage, {
  rejectedFallback: <NotFoundPage />,
});
```

**동작:**

- API 실패 → useSuspenseQuery가 에러 throw
- ErrorBoundary가 catch → fallback 표시
- URL 변경 → resetKeys로 에러 상태 리셋 필요

### 비교

|               | useQuery               | useSuspenseQuery + HOC |
| ------------- | ---------------------- | ---------------------- |
| 코드량        | 매 컴포넌트마다 if문   | 성공 케이스만 작성     |
| 일관성        | 개발자마다 다르게 처리 | 패턴 강제              |
| SSR/Streaming | 지원 안됨              | **지원됨**             |
| 복잡도        | 단순                   | resetKeys 필요         |
| URL 변경 시   | 자동 refetch           | resetKeys로 리셋 필요  |

### 언제 뭘 쓸까?

```
단순한 앱, 빠른 개발
  → useQuery + 인라인 처리

대규모 앱, 팀 프로젝트, SSR
  → useSuspenseQuery + HOC
```

### 현재 프로젝트 선택 이유

- `withAsyncBoundary`가 이미 있고 일관되게 사용 중
- 관심사 분리 패턴 유지
- resetKeys 추가로 문제 해결됨
- **HOC 패턴 유지**

---

## withAsyncBoundary 상세 설명

### Props

```tsx
interface AsyncBoundaryProps {
  rejectedFallback?: ReactNode; // 에러 시 표시할 UI (기본: ErrorPage)
  pendingFallback?: ReactNode; // 로딩 시 표시할 UI (기본: CenteredLoading)
}
```

### 내부 동작

```tsx
export default function withAsyncBoundary<Props>(
  WrappedComponent: ComponentType<Props>,
  { pendingFallback, rejectedFallback }: AsyncBoundaryProps = {},
) {
  return (props: Props) => {
    // URL 변경 감지를 위해 location 사용
    const location = useLocation();

    return (
      // 1. ErrorBoundary: 에러 catch + resetKeys로 URL 변경 감지
      <ErrorBoundary fallback={rejectedFallback} resetKeys={[location.search]}>
        {/* 2. Suspense: 로딩 상태 처리 */}
        <Suspense fallback={pendingFallback}>
          {/* 3. 실제 컴포넌트: 성공 케이스만 처리 */}
          <WrappedComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}
```

### 렌더링 순서

```
1. 초기 로딩
   Suspense가 pendingFallback 표시
       ↓
2. API 성공
   WrappedComponent 렌더링
       ↓
3. API 실패
   ErrorBoundary가 rejectedFallback 표시
       ↓
4. URL 변경 (재검색)
   resetKeys 변경 감지 → ErrorBoundary 리셋 → 1번으로
```

### 사용 시 주의사항

1. **useSuspenseQuery 필수**: 일반 useQuery는 에러를 throw하지 않음
2. **Router 내부에서 사용**: useLocation 훅 사용하므로 RouterProvider 하위에서만 동작
3. **resetKeys 확장 가능**: 다른 값 변경도 감지하려면 배열에 추가
   ```tsx
   resetKeys={[location.search, userId, theme]}
   ```
