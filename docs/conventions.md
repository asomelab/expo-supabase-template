# Conventions

> Naming rules, file organization, and import ordering for Lasu Financial.

---

## File Naming

**All files use `kebab-case`** — no exceptions.

| Type              | Pattern              | Example               |
| ----------------- | -------------------- | --------------------- |
| Components        | `kebab-case.tsx`     | `themed-text.tsx`     |
| Platform-specific | `kebab-case.ios.tsx` | `icon-symbol.ios.tsx` |
| Hooks             | `use-*.ts`           | `use-instruments.ts`  |
| Stores            | `*-store.ts`         | `auth-store.ts`       |
| Schemas           | `*.ts`               | `instrument.ts`       |
| Utils             | `*.ts`               | `format.ts`           |
| Lib/Config        | `*.ts`               | `query-client.ts`     |
| Layouts           | `_layout.tsx`        | `_layout.tsx`         |
| Not-found         | `+not-found.tsx`     | `+not-found.tsx`      |
| Barrel exports    | `index.ts`           | `index.ts`            |

### Why kebab-case?

- Avoids case-sensitivity issues across macOS (case-insensitive) and Linux (case-sensitive) file systems
- Consistent with web naming conventions
- Clearly distinguishes files from React components (which remain PascalCase in code)

---

## Component Naming

While **file names** are kebab-case, **component names in code** remain **PascalCase**:

```tsx
// File: components/themed-text.tsx
export function ThemedText({ children, className }: ThemedTextProps) {
  return <Text className={className}>{children}</Text>;
}
```

---

## Directory Organization

### `app/` — Screens Only

Screens live in `app/` and follow [Expo Router conventions](https://docs.expo.dev/router/introduction/). Screens should be thin — they compose components and call hooks, minimal business logic.

```tsx
// ✅ Good — screen is a thin composition layer
export default function PortfolioScreen() {
  const { data, isLoading } = useInstruments();
  return <InstrumentList data={data} isLoading={isLoading} />;
}

// ❌ Bad — too much logic in the screen
export default function PortfolioScreen() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchInstruments().then(setData);
  }, []);
  // ... 100 lines of formatting, filtering, sorting
}
```

### `components/` — Reusable UI

- **`components/ui/`**: Low-level primitives (buttons, inputs, icons)
- **`components/`**: Domain-specific reusable components

### `hooks/` — Custom Hooks

- **`hooks/queries/`**: TanStack Query hooks (one file per entity/domain)
- **`hooks/mutations/`**: TanStack Mutation hooks
- **`hooks/`**: General-purpose hooks (e.g., `use-color-scheme.ts`)

### `schemas/` — Zod Schemas

One file per entity. Always export both the schema and the inferred type:

```typescript
// schemas/instrument.ts
export const instrumentSchema = z.object({ ... });
export type Instrument = z.infer<typeof instrumentSchema>;
export const instrumentListSchema = z.array(instrumentSchema);
```

### `stores/` — Zustand Stores

One file per domain. Avoid mega-stores; keep them focused:

```
stores/
├── auth-store.ts     # Auth state only
├── app-store.ts      # App preferences only
└── portfolio-store.ts  # (future) portfolio-specific UI state
```

### `lib/` — Service Clients

External service initialization. These should be singletons:

```
lib/
├── supabase.ts       # Supabase client
├── axios.ts          # Axios instance
├── storage.ts        # MMKV + adapters
└── query-client.ts   # QueryClient
```

---

## Import Ordering

Imports should follow this order, separated by blank lines:

```typescript
// 1. React / React Native
import { useState } from 'react';
import { View, Text } from 'react-native';

// 2. Expo packages
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

// 3. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { z } from 'zod';

// 4. Internal aliases (@/ paths)
import { useInstruments } from '@/hooks/queries/use-instruments';
import { ThemedText } from '@/components/themed-text';
import { formatCurrency } from '@/utils/format';

// 5. Local/relative imports
import type { ScreenProps } from './types';
```

Prettier with `prettier-plugin-tailwindcss` automatically sorts Tailwind classes. ESLint handles code quality. Import sorting is manual (follow the pattern above).

---

## TypeScript Guidelines

### Strict Mode

`tsconfig.json` has strict mode enabled. All code must be fully typed.

### Prefer Types from Zod Schemas

```typescript
// ✅ Single source of truth
import type { Instrument } from '@/schemas';

// ❌ Duplicated type definitions
interface Instrument {
  id: string;
  name: string;
}
```

### Export Patterns

- **Named exports** for components, hooks, utilities, schemas
- **Default exports** only for Expo Router screens (required by framework)
- **Barrel files** (`index.ts`) for directories that benefit from centralized imports

```typescript
// ✅ Named export (components, hooks, utils)
export function ThemedText() { ... }
export function useInstruments() { ... }

// ✅ Default export (screens only)
export default function HomeScreen() { ... }
```

### Avoid `any`

Use `unknown` instead and narrow with type guards or Zod parsing:

```typescript
// ✅ Runtime validation
const result = instrumentSchema.parse(unknownData);

// ❌ Type assertion
const result = unknownData as Instrument;
```

---

## Styling Conventions

### NativeWind Classes

- Use `className` prop for all styling
- Use responsive prefixes sparingly (mobile-first)
- Use `dark:` prefix for dark mode variants
- Use custom theme colors (`primary-*`, `surface-*`, `muted-*`) from `tailwind.config.js`

```tsx
// ✅ Consistent pattern
<View className="flex-1 bg-surface-light p-4 dark:bg-surface-dark">
  <Text className="text-lg font-bold text-primary-600">Title</Text>
</View>
```

### When to Use Inline Styles

Only when you need **dynamic values** that can't be expressed as Tailwind classes:

```tsx
// Animated values from Reanimated
<Animated.View style={[animatedStyle]} />

// Dynamic dimensions
<View style={{ height: headerHeight }} />
```

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

feat(portfolio): add holdings breakdown chart
fix(auth): handle expired refresh tokens
chore(deps): update expo sdk to 54
docs(readme): add deployment instructions
refactor(queries): extract shared query options
```

### Types

| Type       | Use For                                          |
| ---------- | ------------------------------------------------ |
| `feat`     | New features                                     |
| `fix`      | Bug fixes                                        |
| `chore`    | Tooling, deps, CI changes                        |
| `docs`     | Documentation only                               |
| `refactor` | Code changes that don't fix bugs or add features |
| `style`    | Formatting, missing semicolons, etc.             |
| `test`     | Adding or updating tests                         |
| `perf`     | Performance improvements                         |
