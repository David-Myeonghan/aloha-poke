import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
  resetKeys?: unknown[];
}
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  // 에러 발생 시 → 상태 업데이트 (순수 함수)
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 다음 렌더링에서 fallback UI를 보여줄 수 있도록 상태를 업데이트합니다.
    return { hasError: true, error };
  }

  /**
   * 리렌더링 완료 후 호출되는 lifecycle 메서드 (첫 렌더링 제외하고, 리렌더링 시 매번 호출)
   * prevProps: React가 자동으로 전달하는 이전 props (리렌더링 전 상태)
   * this.props: 현재 props (리렌더링 후 상태)
   * 용도: 이전 props/state와 현재 값 비교하여 추가 작업
   */
  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // 에러 상태가 아니면 체크할 필요 없음
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

  // 자식 컴포넌트에서 에러가 throw 된 후 호출
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 여기에서 에러 리포팅 서비스에 에러를 기록할 수 있습니다.
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
