# @mydav/design-system

React component design system with Button, Typography, Loading, and LazyLoadImage components.

## Installation

```bash
# npm
npm install @mydav/design-system

# yarn
yarn add @mydav/design-system

# pnpm
pnpm add @mydav/design-system
```

## Quick Start

```tsx
import { Button, Typography, Loading, LazyLoadImage } from '@mydav/design-system';
import '@mydav/design-system/styles';

function App() {
  return (
    <div>
      <Typography size="t1">Hello World</Typography>
      <Button size="medium" color="primary">
        Click me
      </Button>
    </div>
  );
}
```

## Components

### Button

```tsx
<Button size="medium" color="primary" onClick={handleClick}>
  Click me
</Button>

<Button size="small" color="error" disabled>
  Delete
</Button>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'massive'` | `'medium'` | Button size |
| `color` | `'primary' \| 'error'` | `'primary'` | Button color |

### Typography

```tsx
<Typography size="t1" as="h1">Heading</Typography>
<Typography size="t4" as="p">Body text</Typography>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'t1' \| 't2' \| 't3' \| 't4'` | - | Typography size (required) |
| `as` | `React.ElementType` | `'span'` | HTML element to render |

### Loading

```tsx
<Loading size="medium" />
<Loading size="small" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium'` | `'medium'` | Spinner size |

### LazyLoadImage

```tsx
<LazyLoadImage
  imageSource="https://example.com/image.jpg"
  alt="Description"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageSource` | `string` | - | Image URL (required) |
| `alt` | `string` | `''` | Alt text |

## Design Tokens

### Colors

```ts
const colors = {
  primary: { light: "#71b3ff", main: "#3196ef", dark: "#0062b7" },
  error: { light: "#f3869d", main: "#ec3a5d", dark: "#c5082f" },
  common: { white: "#fff", black: "#000", grey: "#727274" },
  background: { header: "#1f2949", primary: "#5b92d3", secondary: "#6e7c99", border: "#98a6c0" },
};
```

### Typography Scale

| Size | Font Size | Line Height | Weight |
|------|-----------|-------------|--------|
| t1 | 32px | 44px | 700 |
| t2 | 24px | 34px | 700 |
| t3 | 18px | 28px | 600 |
| t4 | 16px | 24px | 400 |

### CSS Custom Properties

```css
.my-element {
  color: var(--color-primary-main);
  background: var(--color-background-header);
}
```

## Requirements

- React 18.0.0 or higher
- React DOM 18.0.0 or higher

## License

MIT
