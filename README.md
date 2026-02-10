# Lasu Financial

> Investment portfolio tracker built with Expo & React Native — track holdings, monitor performance, and stay on top of your investments.

[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-53-blue)](https://docs.expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.79-61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/NativeWind-4.x-06B6D4)](https://www.nativewind.dev/)
[![License](https://img.shields.io/badge/License-0BSD-green)](LICENSE)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Architecture](#project-architecture)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [State Management Patterns](#state-management-patterns)
- [Data Flow](#data-flow)
- [Form Handling](#form-handling)
- [Styling Guide](#styling-guide)
- [Building & Deployment](#building--deployment)
- [Documentation Index](#documentation-index)
- [Contributing](#contributing)

---

## Tech Stack

| Category         | Technology                                                                  | Purpose                            |
| ---------------- | --------------------------------------------------------------------------- | ---------------------------------- |
| **Framework**    | [Expo SDK 53](https://docs.expo.dev/) + Expo Router v5                      | App framework & file-based routing |
| **Language**     | [TypeScript 5.8](https://www.typescriptlang.org/) (strict mode)             | Type-safe development              |
| **Styling**      | [NativeWind v4](https://www.nativewind.dev/) + Tailwind CSS v3              | Utility-first styling              |
| **Backend**      | [Supabase](https://supabase.com/) (Auth, Postgres, Realtime)                | Backend-as-a-service               |
| **Server State** | [TanStack Query v5](https://tanstack.com/query)                             | Async state management & caching   |
| **Client State** | [Zustand v5](https://zustand-demo.pmnd.rs/)                                 | Lightweight global state           |
| **Forms**        | [TanStack Form v1](https://tanstack.com/form)                               | Type-safe form management          |
| **Validation**   | [Zod v3](https://zod.dev/)                                                  | Runtime type validation & schemas  |
| **HTTP Client**  | [Axios](https://axios-http.com/)                                            | External API calls                 |
| **Lists**        | [@shopify/flash-list](https://shopify.github.io/flash-list/)                | High-performance lists             |
| **Storage**      | [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)          | Fast synchronous key-value storage |
| **Animations**   | [Reanimated v3](https://docs.swmansion.com/react-native-reanimated/)        | Native-thread animations           |
| **Gestures**     | [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) | Native gesture recognition         |
| **Icons**        | [@expo/vector-icons](https://icons.expo.fyi/)                               | Icon library (+ SF Symbols on iOS) |
| **Code Quality** | ESLint + Prettier + Husky + lint-staged                                     | Automated formatting & linting     |
| **CI/CD**        | [EAS Build/Update/Workflows](https://docs.expo.dev/eas/)                    | Cloud builds & OTA updates         |

---

## Prerequisites

| Tool               | Version | Install                                                                      |
| ------------------ | ------- | ---------------------------------------------------------------------------- |
| **Node.js**        | >= 20.x | [nodejs.org](https://nodejs.org/) or `nvm install 20`                        |
| **pnpm**           | >= 9.x  | `npm install -g pnpm`                                                        |
| **Expo CLI**       | latest  | `npm install -g expo-cli` (or use `npx expo`)                                |
| **EAS CLI**        | latest  | `npm install -g eas-cli`                                                     |
| **Supabase CLI**   | latest  | `brew install supabase/tap/supabase`                                         |
| **Git**            | >= 2.x  | [git-scm.com](https://git-scm.com/)                                          |
| **Xcode**          | >= 15   | Mac App Store (iOS development only)                                         |
| **Android Studio** | latest  | [developer.android.com](https://developer.android.com/studio) (Android only) |

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/lasu-financial.git
cd lasu-financial

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.development
# Edit .env.development with your Supabase credentials

# 4. Start the development server
pnpm start

# 5. Run on a specific platform
pnpm ios       # iOS Simulator
pnpm android   # Android Emulator
pnpm web       # Web browser
```

> **Note:** Some native modules (MMKV, FlashList) require a development build. If you encounter errors in Expo Go, create a development build with `pnpm development-builds` or `npx expo run:ios`.

---

## Project Architecture

```
lasu-financial/
├── app/                          # Expo Router — file-based routing (screens only)
│   ├── _layout.tsx               # Root layout (providers, fonts, theme)
│   ├── +not-found.tsx            # 404 screen
│   ├── (auth)/                   # Auth route group (login, register)
│   │   └── _layout.tsx           # Auth stack layout
│   └── (tabs)/                   # Main tab navigation
│       ├── _layout.tsx           # Tab bar configuration
│       ├── index.tsx             # Home / Portfolio screen
│       └── explore.tsx           # Market exploration screen
│
├── components/                   # Reusable React components
│   ├── ui/                       # Low-level UI primitives
│   │   ├── icon-symbol.tsx       # Cross-platform icon component
│   │   ├── icon-symbol.ios.tsx   # iOS-specific (SF Symbols)
│   │   ├── tab-bar-background.tsx
│   │   └── tab-bar-background.ios.tsx
│   ├── themed-text.tsx           # Theme-aware text with NativeWind
│   ├── themed-view.tsx           # Theme-aware view container
│   ├── collapsible.tsx           # Expandable section
│   ├── external-link.tsx         # In-app browser link
│   ├── haptic-tab.tsx            # Tab button with haptic feedback
│   ├── hello-wave.tsx            # Animated wave component
│   └── parallax-scroll-view.tsx  # Parallax header scroll view
│
├── hooks/                        # Custom React hooks
│   ├── queries/                  # TanStack Query hooks (server state)
│   │   ├── index.ts              # Query key exports
│   │   └── use-instruments.ts    # Instrument list query
│   ├── mutations/                # TanStack Mutation hooks
│   │   └── index.ts              # Mutation placeholder
│   ├── use-color-scheme.ts       # System color scheme hook
│   ├── use-color-scheme.web.ts   # Web-specific hydration-safe variant
│   └── use-theme-color.ts        # Theme color resolver
│
├── lib/                          # External service clients & configuration
│   ├── supabase.ts               # Supabase client (auth + database)
│   ├── axios.ts                  # Axios instance for external APIs
│   ├── storage.ts                # MMKV storage (+ Zustand/Supabase adapters)
│   └── query-client.ts           # TanStack QueryClient configuration
│
├── providers/                    # React context providers
│   └── query-provider.tsx        # TanStack Query + network/focus management
│
├── schemas/                      # Zod schemas — single source of truth for types
│   ├── index.ts                  # Central schema exports
│   ├── instrument.ts             # Instrument schema & type
│   └── user.ts                   # User profile schema & type
│
├── stores/                       # Zustand stores — client-side state
│   ├── auth-store.ts             # Authentication state (persisted via MMKV)
│   └── app-store.ts              # App preferences (theme, onboarding)
│
├── utils/                        # Pure utility functions
│   └── format.ts                 # Currency & percentage formatters
│
├── constants/                    # Static app constants
│   └── colors.ts                 # Theme color tokens
│
├── types/                        # Global TypeScript declarations
│
├── config/                       # Tool configurations
│
├── assets/                       # Static assets
│   ├── fonts/                    # Custom fonts (SpaceMono)
│   └── images/                   # App icons, splash screen, images
│
├── docs/                         # Extended documentation
│   ├── architecture.md           # Data flow & state management
│   ├── conventions.md            # Naming & file organization rules
│   └── environment.md            # Environment setup guide
│
├── scripts/                      # Utility scripts
│   └── reset-project.js          # Reset to blank template
│
├── .eas/workflows/               # EAS CI/CD workflow definitions
│   ├── create-draft.yml          # Preview update on push
│   ├── create-development-builds.yml
│   └── deploy-to-production.yml  # Production build + store submission
│
├── .husky/                       # Git hooks (Husky)
│   └── pre-commit                # Runs lint-staged before commit
│
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build profiles
├── babel.config.js               # Babel config (NativeWind preset)
├── metro.config.js               # Metro bundler (NativeWind integration)
├── tailwind.config.js            # Tailwind CSS configuration
├── global.css                    # Tailwind directives
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.js              # ESLint flat config
├── .prettierrc                   # Prettier configuration
├── nativewind-env.d.ts           # NativeWind type declarations
└── package.json                  # Dependencies, scripts, lint-staged config
```

### Naming Convention

This project uses **kebab-case** for all file names:

| Type       | Example              |
| ---------- | -------------------- |
| Components | `themed-text.tsx`    |
| Hooks      | `use-instruments.ts` |
| Stores     | `auth-store.ts`      |
| Schemas    | `instrument.ts`      |
| Utils      | `format.ts`          |
| Lib/Config | `query-client.ts`    |

---

## Available Scripts

| Script                    | Command                | Description                                |
| ------------------------- | ---------------------- | ------------------------------------------ |
| `pnpm start`              | `expo start`           | Start Expo dev server                      |
| `pnpm start:clear`        | `expo start --clear`   | Start with cleared Metro cache             |
| `pnpm ios`                | `expo start --ios`     | Start on iOS Simulator                     |
| `pnpm android`            | `expo start --android` | Start on Android Emulator                  |
| `pnpm web`                | `expo start --web`     | Start in web browser                       |
| `pnpm lint`               | `expo lint`            | Run ESLint                                 |
| `pnpm lint:fix`           | `expo lint --fix`      | Auto-fix lint errors                       |
| `pnpm format`             | `prettier --write ...` | Format all files with Prettier             |
| `pnpm format:check`       | `prettier --check ...` | Check formatting without writing           |
| `pnpm typecheck`          | `tsc --noEmit`         | Type-check without emitting files          |
| `pnpm doctor`             | `expo doctor`          | Check project health & dependency versions |
| `pnpm draft`              | EAS Workflow           | Publish preview update + deploy website    |
| `pnpm development-builds` | EAS Workflow           | Build dev clients for Android & iOS        |
| `pnpm deploy`             | EAS Workflow           | Production build with store submission     |

---

## Environment Variables

| Variable                               | Required | Description                   |
| -------------------------------------- | -------- | ----------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`             | Yes      | Your Supabase project URL     |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes      | Your Supabase anon/public key |

```bash
# Copy the example and fill in your values
cp .env.example .env.development
```

See [docs/environment.md](docs/environment.md) for full setup instructions.

---

## Development Workflow

### Git Hooks (Husky)

Every commit triggers **lint-staged** via Husky's `pre-commit` hook:

- **`.ts` / `.tsx` files**: ESLint auto-fix + Prettier formatting
- **`.json` / `.md` / `.css` files**: Prettier formatting

### Branching Strategy

```
main                 ← production-ready code
├── develop          ← integration branch
│   ├── feature/*    ← new features
│   ├── fix/*        ← bug fixes
│   └── chore/*      ← maintenance tasks
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add portfolio summary card
fix: correct currency formatting for JPY
chore: update dependencies
docs: add state management guide
```

---

## State Management Patterns

### Decision Tree

```
Is the data from an API / database?
├── YES → TanStack Query (useQuery / useMutation)
│         Cached, deduplicated, background-refreshed
│
└── NO → Is it shared across multiple screens?
    ├── YES → Zustand store
    │         Persisted to MMKV if needed
    │
    └── NO → React local state (useState / useReducer)
```

### TanStack Query (Server State)

Used for **all** data that comes from Supabase or external APIs:

```tsx
// hooks/queries/use-instruments.ts
export function useInstruments() {
  return useQuery({
    queryKey: instrumentKeys.lists(),
    queryFn: fetchInstruments, // Supabase + Zod validation
  });
}

// In your component:
const { data, isLoading, error } = useInstruments();
```

### Zustand (Client State)

Used for **app-level UI state** that persists across sessions:

```tsx
// stores/auth-store.ts — persisted to MMKV
const { isAuthenticated, setSession, clearSession } = useAuthStore();

// stores/app-store.ts — theme preference, onboarding
const { themeMode, setThemeMode } = useAppStore();
```

### Local State

For **component-scoped** state that doesn't need to be shared:

```tsx
const [isModalOpen, setIsModalOpen] = useState(false);
```

---

## Data Flow

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Supabase   │────▶│  TanStack Query  │────▶│  Component   │
│  (Postgres) │     │  (cache layer)   │     │  (UI)        │
└─────────────┘     └──────────────────┘     └──────────────┘
                            │
                    ┌───────┴────────┐
                    │  Zod Schema    │
                    │  (validation)  │
                    └────────────────┘

┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│   MMKV      │◀───▶│    Zustand       │◀───▶│  Component   │
│  (storage)  │     │  (client state)  │     │  (UI)        │
└─────────────┘     └──────────────────┘     └──────────────┘

┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│  External   │────▶│     Axios        │────▶│  TanStack    │
│  APIs       │     │  (HTTP client)   │     │  Query       │
└─────────────┘     └──────────────────┘     └──────────────┘
```

---

## Form Handling

Forms use **TanStack Form + Zod** for type-safe validation:

```tsx
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().positive('Amount must be positive'),
});

function MyForm() {
  const form = useForm({
    defaultValues: { name: '', amount: 0 },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      // Submit to Supabase via a mutation hook
    },
  });

  return (
    <form.Field name="name">
      {(field) => (
        <TextInput
          value={field.state.value}
          onChangeText={field.handleChange}
          onBlur={field.handleBlur}
        />
      )}
    </form.Field>
  );
}
```

---

## Styling Guide

### NativeWind (Tailwind CSS for React Native)

All styling uses NativeWind `className` prop:

```tsx
// ✅ Do this
<View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
  <Text className="text-xl font-bold text-primary-500">Hello</Text>
</View>

// ❌ Avoid StyleSheet.create() for new code
```

### Dark Mode

Use the `dark:` prefix for dark mode styles:

```tsx
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-gray-100">Adaptive text</Text>
</View>
```

### Custom Theme Colors

Defined in `tailwind.config.js`:

- `primary-{50..950}` — Brand blue palette
- `surface-{light,dark}` — Background colors
- `muted-{light,dark}` — Subtle text/icon colors

---

## Building & Deployment

### EAS Build Profiles

| Profile                 | Purpose                             | Distribution           |
| ----------------------- | ----------------------------------- | ---------------------- |
| `development`           | Dev builds with dev client          | Internal               |
| `development-simulator` | iOS Simulator dev builds            | Internal               |
| `preview`               | Internal testing builds             | Internal               |
| `production`            | Store-ready builds (auto-increment) | App Store / Play Store |

### Commands

```bash
# Development build
npx eas-cli@latest build --profile development --platform ios

# Preview build (internal distribution)
npx eas-cli@latest build --profile preview --platform all

# Production build + store submission
npx eas-cli@latest build --profile production --platform ios --submit

# OTA update (no new build needed)
npx eas-cli@latest update --branch production --message "Bug fix"
```

### EAS Workflows (CI/CD)

Pre-configured workflows in `.eas/workflows/`:

- **`create-draft.yml`** — On push: preview update + website deploy
- **`create-development-builds.yml`** — Build dev clients for all platforms
- **`deploy-to-production.yml`** — Smart fingerprint-based builds/updates + store submission

---

## Documentation Index

| Document                                     | Description                                      |
| -------------------------------------------- | ------------------------------------------------ |
| [docs/architecture.md](docs/architecture.md) | Data flow, state management decision tree        |
| [docs/conventions.md](docs/conventions.md)   | Naming rules, file organization, import ordering |
| [docs/environment.md](docs/environment.md)   | Environment setup, Supabase CLI, dev tools       |
| [AGENTS.md](AGENTS.md)                       | AI agent instructions for this codebase          |

---

## Contributing

1. Create a feature branch from `main`: `git checkout -b feature/my-feature`
2. Make your changes following the conventions in [docs/conventions.md](docs/conventions.md)
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/)
4. Husky will auto-lint and format your staged files
5. Open a Pull Request against `main`

---

## License

[0BSD](LICENSE) — Free to use for any purpose.
