import { useEffect, useState } from "react";

export default function useIndexChange(maxLength: number) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (maxLength === 0) return;

    const indexInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % maxLength);
    }, 2000);

    return () => {
      clearInterval(indexInterval);
    };
  }, [maxLength]);

  return { index };
}
