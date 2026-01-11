import { useState, useEffect } from "react";
import { debounce } from "utils/rateLimit";

// 레이아웃 상수
const CARD_WIDTH = 200; // 카드 너비 (px)
const GAP = 12; // 카드 사이 간격 (px)
const CONTAINER_PADDING = 16; // 좌우 패딩 + 스크롤바 여유 (px)

/**
 * 화면 너비 기준 한 줄에 들어가는 카드 개수 계산
 * 공식: (사용가능너비 + 간격) / (카드너비 + 간격)
 * 예: 1060px → (1044 + 12) / (200 + 12) = 4.98 → 4개
 */
function calculateCardsPerRow(): number {
  const availableWidth = window.innerWidth - CONTAINER_PADDING;
  const availableRow = Math.floor((availableWidth + GAP) / (CARD_WIDTH + GAP));
  return Math.max(1, availableRow);
}

/**
 * 화면 너비에 따라 한 줄 카드 개수를 반환하는 훅
 * 리사이즈 시 자동 재계산
 */
export function useItemsPerRow(): number {
  const [itemsPerRow, setItemsPerRow] = useState(calculateCardsPerRow);

  useEffect(() => {
    const handleResize = debounce(() => {
      setItemsPerRow(calculateCardsPerRow());
    }, 300);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return itemsPerRow;
}
