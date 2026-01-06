import { useEffect, useState, useCallback, useRef } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
  onChange?: () => void;
}

export function useIntersectionObserver({
  threshold = 0.1, // ref가 10% 보이면 트리거
  rootMargin = "100px", // ref 도달하기 100px 전에 트리거
  enabled = true,
  onChange,
}: UseIntersectionObserverOptions = {}) {
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!enabled || !triggerRef.current) return;

    const element = triggerRef.current; // cleanup에서 사용할 참조 저장
    const observer = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          onChange?.();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => observer.disconnect(); // unobserve 대신 disconnect
  }, [enabled, threshold, rootMargin, onChange]);

  return { ref: triggerRef };
}
