import { useEffect } from "react";

export function useScrollRestoration(key: string) {
  useEffect(() => {
    // 복원
    const savedY = sessionStorage.getItem(key);
    if (savedY) {
      window.scrollTo(0, parseInt(savedY, 10));
    }

    // 저장
    const handleScroll = () => {
      sessionStorage.setItem(key, window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [key]);
}
