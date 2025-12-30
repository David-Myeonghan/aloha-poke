# 컴포넌트 API

## Button

```typescript
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  size?: "small" | "medium" | "massive";
  color?: "primary" | "error";
  children?: React.ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}
```

### 사용 예시

```tsx
import { Button } from '@mydav/design-system';

<Button size="medium" color="primary" onClick={handleClick}>
  Click me
</Button>

<Button size="small" color="error" disabled>
  Delete
</Button>
```

---

## Typography

```typescript
interface TypographyProps extends HTMLAttributes<HTMLElement> {
  size: "t1" | "t2" | "t3" | "t4";
  as?: React.ElementType;
  children?: React.ReactNode;
}
```

### 사용 예시

```tsx
import { Typography } from '@mydav/design-system';

<Typography size="t1" as="h1">
  제목
</Typography>

<Typography size="t4" as="p">
  본문 텍스트
</Typography>
```

---

## Loading

```typescript
interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: "small" | "medium";
}
```

### 사용 예시

```tsx
import { Loading } from '@mydav/design-system';

<Loading size="medium" />

<Loading size="small" />
```

---

## LazyLoadImage

```typescript
interface LazyLoadImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  imageSource: string;
  alt?: string;
}
```

### 사용 예시

```tsx
import { LazyLoadImage } from '@mydav/design-system';

<LazyLoadImage
  imageSource="https://example.com/image.jpg"
  alt="설명"
/>
```
