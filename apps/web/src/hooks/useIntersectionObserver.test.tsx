import { render, screen } from "@testing-library/react";
import { useIntersectionObserver } from "./useIntersectionObserver";

// IntersectionObserver mock
let mockObserverCallback: IntersectionObserverCallback | null = null;
let mockObserverOptions: IntersectionObserverInit | undefined;

const mockObserve = jest.fn();
const mockDisconnect = jest.fn();

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    mockObserverCallback = callback;
    mockObserverOptions = options;
  }

  observe = mockObserve;
  unobserve = jest.fn();
  disconnect = mockDisconnect;
  takeRecords = jest.fn(() => []);
}

global.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;

function triggerIntersection(isIntersecting: boolean) {
  if (mockObserverCallback) {
    const entry = {
      isIntersecting,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      target: document.createElement("div"),
      time: Date.now(),
    };
    mockObserverCallback([entry], {} as IntersectionObserver);
  }
}

// Test component that uses the hook
interface TestComponentProps {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
  onChange?: () => void;
}

function TestComponent({
  threshold,
  rootMargin,
  enabled,
  onChange,
}: TestComponentProps) {
  const { ref } = useIntersectionObserver({
    threshold,
    rootMargin,
    enabled,
    onChange,
  });

  return <div ref={ref} data-testid="sentinel" />;
}

describe("useIntersectionObserver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockObserverCallback = null;
    mockObserverOptions = undefined;
  });

  describe("반환값", () => {
    it("ref가 DOM 요소에 연결된다", () => {
      // Act
      render(<TestComponent />);

      // Assert
      expect(screen.getByTestId("sentinel")).toBeInTheDocument();
    });
  });

  describe("Observer 생성", () => {
    it("기본값으로 Observer를 생성한다", () => {
      // Act
      render(<TestComponent />);

      // Assert
      expect(mockObserverOptions?.threshold).toBe(0.1);
      expect(mockObserverOptions?.rootMargin).toBe("100px");
    });

    it("커스텀 옵션으로 Observer를 생성한다", () => {
      // Act
      render(<TestComponent threshold={0.5} rootMargin="200px" />);

      // Assert
      expect(mockObserverOptions?.threshold).toBe(0.5);
      expect(mockObserverOptions?.rootMargin).toBe("200px");
    });

    it("Observer가 요소를 observe한다", () => {
      // Act
      render(<TestComponent />);

      // Assert
      expect(mockObserve).toHaveBeenCalledTimes(1);
    });
  });

  describe("onChange 콜백", () => {
    it("요소가 viewport에 들어오면 onChange를 호출한다", () => {
      // Arrange
      const onChange = jest.fn();
      render(<TestComponent onChange={onChange} />);

      // Act
      triggerIntersection(true);

      // Assert
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("요소가 viewport를 벗어나면 onChange를 호출하지 않는다", () => {
      // Arrange
      const onChange = jest.fn();
      render(<TestComponent onChange={onChange} />);

      // Act
      triggerIntersection(false);

      // Assert
      expect(onChange).not.toHaveBeenCalled();
    });

    it("onChange가 없으면 에러 없이 동작한다", () => {
      // Arrange
      render(<TestComponent />);

      // Act & Assert
      expect(() => triggerIntersection(true)).not.toThrow();
    });
  });

  describe("enabled 옵션", () => {
    it("enabled가 false면 Observer를 생성하지 않는다", () => {
      // Arrange
      const onChange = jest.fn();

      // Act
      render(<TestComponent enabled={false} onChange={onChange} />);

      // Assert
      expect(mockObserve).not.toHaveBeenCalled();
    });

    it("enabled가 true면 Observer가 요소를 관찰한다", () => {
      // Arrange
      const onChange = jest.fn();

      // Act
      render(<TestComponent enabled={true} onChange={onChange} />);

      // Assert
      expect(mockObserve).toHaveBeenCalledTimes(1);
    });

    it("enabled가 false → true로 변경되면 Observer를 생성한다", () => {
      // Arrange
      const onChange = jest.fn();
      const { rerender } = render(
        <TestComponent enabled={false} onChange={onChange} />,
      );

      expect(mockObserve).not.toHaveBeenCalled();

      // Act
      rerender(<TestComponent enabled={true} onChange={onChange} />);

      // Assert
      expect(mockObserve).toHaveBeenCalledTimes(1);
    });
  });

  describe("cleanup", () => {
    it("unmount 시 Observer를 disconnect한다", () => {
      // Arrange
      const { unmount } = render(<TestComponent />);

      // Act
      unmount();

      // Assert
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it("enabled가 true → false로 변경되면 Observer를 disconnect한다", () => {
      // Arrange
      const { rerender } = render(<TestComponent enabled={true} />);

      // Act
      rerender(<TestComponent enabled={false} />);

      // Assert
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
  });
});
