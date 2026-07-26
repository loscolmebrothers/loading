# @loscolmebrothers/loading

GSAP-powered loading overlay with staggered slice animations. Stacks image "slices" vertically, plays an entrance → idle → exit animation lifecycle, and can be driven by either a `duration` prop or an external `finish()` trigger.

## Installation

```bash
pnpm add @loscolmebrothers/loading
```

Git dependency (requires SSH access to `loscolmebrothers/loading`):

```json
{
  "dependencies": {
    "@loscolmebrothers/loading": "git+ssh://git@github.com/loscolmebrothers/loading.git"
  }
}
```

### Peer dependencies

```json
{
  "react": ">=18",
  "react-dom": ">=18",
  "gsap": ">=3.12"
}
```

## Usage

```tsx
import { Loading, type LoadingHandle } from "@loscolmebrothers/loading";
```

### Duration mode (auto-finish)

```tsx
<Loading duration={2200} onFinish={() => startScene()} />
```

### Trigger mode (caller-controlled)

```tsx
const ref = useRef<LoadingHandle>(null);

<Loading ref={ref} onFinish={() => startScene()} />

ref.current?.finish();
```

### Custom slices

```tsx
<Loading
  slices={[
    { src: "/logo-part-1.svg", alt: "Part 1" },
    { src: "/logo-part-2.svg", alt: "Part 2" },
  ]}
  duration={2200}
  onFinish={startScene}
/>
```

## Props

| Prop        | Type                              | Default          | Description                                      |
| ----------- | --------------------------------- | ---------------- | ------------------------------------------------ |
| `slices`    | `LoadingSlice[]`                  | LOS / COLME / BROTHERS | Images stacked vertically                   |
| `className` | `string`                          | `""`             | Extra classes on the overlay                     |
| `duration`  | `number` (ms)                     | `undefined`      | Auto-finish after N ms. Omit for trigger mode.   |
| `onFinish`  | `() => void`                      | `undefined`      | Called when loading completes (both modes)       |

## Handle

`finish(onComplete?)` — manually trigger the exit animation.

## Animation phases

1. **Entrance** — slices rise in with `back.out(1.5)`, staggered, landing at 50% opacity.
2. **Idle** — gentle balloon bob + subtle opacity breathing (0.3 ↔ 0.5, staggered).
3. **Exit** — brief downward drift, then slices rise up and fade, overlay fades out.

## Development

```bash
pnpm install
pnpm build     # tsc → dist/
pnpm dev       # watch mode
```

Source lives in `src/`, compiled output in `dist/` (committed for consumer convenience — no build-on-install needed).
