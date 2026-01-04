import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock modules before importing component
const mockFetchNextPage = jest.fn();

jest.mock("queries/usePokemonInfiniteList", () => ({
  usePokemonInfiniteList: jest.fn(),
}));

jest.mock("utils/HOC", () => ({
  withAsyncBoundary: (Component: React.ComponentType) => Component,
}));

import MainList from "./MainList";
import { usePokemonInfiniteList } from "queries/usePokemonInfiniteList";

const mockedUsePokemonInfiniteList =
  usePokemonInfiniteList as jest.MockedFunction<typeof usePokemonInfiniteList>;

// IntersectionObserver mock with trigger capability
let intersectionCallback: IntersectionObserverCallback | null = null;

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
}

global.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;

function triggerIntersection(isIntersecting: boolean) {
  if (intersectionCallback) {
    const entry = {
      isIntersecting,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      target: document.createElement("div"),
      time: Date.now(),
    };
    intersectionCallback([entry], {} as IntersectionObserver);
  }
}

function createMockData(hasNextPage: boolean = true) {
  return {
    pages: [
      {
        count: 100,
        next: hasNextPage
          ? "https://pokeapi.co/api/v2/pokemon?offset=20"
          : null,
        previous: null,
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
        ],
      },
    ],
    pageParams: [0],
  };
}

function renderMainList() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <MainList />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("MainList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    intersectionCallback = null;
  });

  describe("렌더링", () => {
    it("포켓몬 리스트를 렌더링한다", () => {
      // Arrange
      mockedUsePokemonInfiniteList.mockReturnValue({
        data: createMockData(),
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
      } as unknown as ReturnType<typeof usePokemonInfiniteList>);

      // Act
      renderMainList();

      // Assert
      expect(screen.getByText("bulbasaur")).toBeInTheDocument();
      expect(screen.getByText("ivysaur")).toBeInTheDocument();
    });
  });

  describe("무한 스크롤", () => {
    it("sentinel이 viewport에 들어오면 fetchNextPage를 호출한다", () => {
      // Arrange
      mockedUsePokemonInfiniteList.mockReturnValue({
        data: createMockData(),
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
      } as unknown as ReturnType<typeof usePokemonInfiniteList>);

      renderMainList();

      // Act
      act(() => {
        triggerIntersection(true);
      });

      // Assert
      expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
    });

    it("hasNextPage가 false면 fetchNextPage를 호출하지 않는다", () => {
      // Arrange
      mockedUsePokemonInfiniteList.mockReturnValue({
        data: createMockData(false),
        fetchNextPage: mockFetchNextPage,
        hasNextPage: false,
        isFetchingNextPage: false,
      } as unknown as ReturnType<typeof usePokemonInfiniteList>);

      renderMainList();

      // Act
      act(() => {
        triggerIntersection(true);
      });

      // Assert
      expect(mockFetchNextPage).not.toHaveBeenCalled();
    });

    it("isFetchingNextPage가 true면 fetchNextPage를 호출하지 않는다", () => {
      // Arrange
      mockedUsePokemonInfiniteList.mockReturnValue({
        data: createMockData(),
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: true,
      } as unknown as ReturnType<typeof usePokemonInfiniteList>);

      renderMainList();

      // Act
      act(() => {
        triggerIntersection(true);
      });

      // Assert
      expect(mockFetchNextPage).not.toHaveBeenCalled();
    });

    it("isIntersecting이 true로 유지될 때 fetchNextPage를 한 번만 호출한다 (무한 로딩 방지)", () => {
      // Arrange: mock 먼저 설정
      mockedUsePokemonInfiniteList.mockReturnValue({
        data: createMockData(),
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
      } as unknown as ReturnType<typeof usePokemonInfiniteList>);

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });

      const { rerender } = render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MainList />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      // Act: sentinel이 viewport에 들어옴
      act(() => {
        triggerIntersection(true);
      });

      expect(mockFetchNextPage).toHaveBeenCalledTimes(1);

      // 두 번째 상태: isFetchingNextPage 변경 시뮬레이션
      // isIntersecting은 여전히 true (triggerIntersection(true) 다시 호출하지 않음)
      mockedUsePokemonInfiniteList.mockReturnValue({
        data: createMockData(),
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
      } as unknown as ReturnType<typeof usePokemonInfiniteList>);

      // Act: 리렌더 (isFetchingNextPage 상태 변경 시뮬레이션)
      rerender(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MainList />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      // Assert: 여전히 1번만 호출됨 (무한 로딩 버그 수정 확인)
      expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
    });

    it("isIntersecting이 false → true로 변경될 때만 fetchNextPage를 호출한다", () => {
      // Arrange
      mockedUsePokemonInfiniteList.mockReturnValue({
        data: createMockData(),
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
      } as unknown as ReturnType<typeof usePokemonInfiniteList>);

      renderMainList();

      // Act: false → true
      act(() => {
        triggerIntersection(false);
      });
      act(() => {
        triggerIntersection(true);
      });

      expect(mockFetchNextPage).toHaveBeenCalledTimes(1);

      // Act: true 유지 상태에서 다시 true 트리거
      act(() => {
        triggerIntersection(true);
      });

      // Assert: 여전히 1번 (엣지 트리거 확인)
      expect(mockFetchNextPage).toHaveBeenCalledTimes(1);

      // Act: false → true 다시
      act(() => {
        triggerIntersection(false);
      });
      act(() => {
        triggerIntersection(true);
      });

      // Assert: 이제 2번
      expect(mockFetchNextPage).toHaveBeenCalledTimes(2);
    });
  });
});
