# AGENTS.md

## Project Overview

**Lasu Financial** is an investment portfolio tracker built with Expo SDK 53 / React Native 0.79. It uses TypeScript in strict mode, NativeWind v4 for styling, Supabase for backend services, and a modern state management stack (TanStack Query + Zustand + Zod). Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Documentation Resources

When working on this project, **always consult the official Expo documentation** available at:

- **https://docs.expo.dev/llms.txt** - Index of all available documentation files
- **https://docs.expo.dev/llms-full.txt** - Complete Expo documentation including Expo Router, Expo Modules API, development process
- **https://docs.expo.dev/llms-eas.txt** - Complete EAS (Expo Application Services) documentation
- **https://docs.expo.dev/llms-sdk.txt** - Complete Expo SDK documentation
- **https://reactnative.dev/docs/getting-started** - Complete React Native documentation

Also refer to:

- [docs/architecture.md](docs/architecture.md) — Data flow, state management decisions
- [docs/conventions.md](docs/conventions.md) — Naming rules, file organization, import ordering
- [docs/environment.md](docs/environment.md) — Environment setup, Supabase CLI, dev tools

## Project Structure

```
/
├── app/                          # Expo Router — file-based routing (screens only)
│   ├── _layout.tsx               # Root layout (providers, fonts, theme)
│   ├── +not-found.tsx            # 404 screen
│   ├── (auth)/                   # Auth route group
│   │   └── _layout.tsx           # Auth stack layout
│   └── (tabs)/                   # Main tab navigation
│       ├── _layout.tsx           # Tab bar config
│       ├── index.tsx             # Home / Portfolio screen
│       └── explore.tsx           # Market exploration screen
├── components/                   # Reusable React components
│   ├── ui/                       # UI primitives (icon-symbol, tab-bar-background)
│   ├── themed-text.tsx           # Theme-aware text (NativeWind)
│   ├── themed-view.tsx           # Theme-aware view
│   ├── collapsible.tsx           # Expandable section
│   ├── external-link.tsx         # In-app browser link
│   ├── haptic-tab.tsx            # Tab button with haptics
│   ├── hello-wave.tsx            # Animated wave
│   └── parallax-scroll-view.tsx  # Parallax header scroll
├── hooks/                        # Custom React hooks
│   ├── queries/                  # TanStack Query hooks
│   │   ├── index.ts              # Query key exports
│   │   └── use-instruments.ts    # Instrument list query
│   ├── mutations/                # TanStack Mutation hooks
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
├── lib/                          # Service clients & configuration
│   ├── supabase.ts               # Supabase client (uses MMKV for auth)
│   ├── axios.ts                  # Axios instance for external APIs
│   ├── storage.ts                # MMKV storage + Zustand/Supabase adapters
│   └── query-client.ts           # TanStack QueryClient config
├── providers/                    # React context providers
│   └── query-provider.tsx        # TanStack Query + network/focus management
├── schemas/                      # Zod schemas (single source of truth for types)
│   ├── index.ts                  # Central exports
│   ├── instrument.ts             # Instrument schema & type
│   └── user.ts                   # User profile schema & type
├── stores/                       # Zustand stores (client state)
│   ├── auth-store.ts             # Auth state (persisted via MMKV)
│   └── app-store.ts              # App preferences (theme, onboarding)
├── utils/                        # Pure utility functions
│   └── format.ts                 # Currency & percentage formatters
├── constants/                    # Static constants
│   └── colors.ts                 # Theme color tokens
├── assets/                       # Static assets (fonts, images)
├── docs/                         # Extended documentation
├── scripts/                      # Utility scripts
├── .eas/workflows/               # EAS CI/CD workflow definitions
├── .husky/                       # Git hooks
│   └── pre-commit                # Runs lint-staged
├── babel.config.js               # Babel (NativeWind preset)
├── metro.config.js               # Metro (NativeWind integration)
├── tailwind.config.js            # Tailwind CSS config
├── global.css                    # Tailwind directives
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build profiles
├── tsconfig.json                 # TypeScript config
├── eslint.config.js              # ESLint flat config
├── .prettierrc                   # Prettier config
└── package.json                  # Dependencies, scripts, lint-staged
```

## Essential Commands

### Development

```bash
pnpm start                       # Start dev server
pnpm start:clear                 # Clear cache and start
pnpm ios                         # Start on iOS Simulator
pnpm android                     # Start on Android Emulator
pnpm web                         # Start in browser
npx expo install <package>       # Install with compatible versions
npx expo install --fix           # Fix version mismatches
pnpm development-builds          # Create development builds (workflow)
```

### Code Quality

```bash
pnpm lint                        # Run ESLint
pnpm lint:fix                    # Auto-fix lint errors
pnpm format                      # Format with Prettier
pnpm format:check                # Check formatting
pnpm typecheck                   # TypeScript type check
pnpm doctor                      # Check project health
```

### Building & Deployment

```bash
pnpm draft                       # Preview update + website (workflow)
pnpm deploy                      # Production build + store submission (workflow)
npx eas-cli@latest build --platform ios -s     # iOS build + submit
npx eas-cli@latest build --platform android -s # Android build + submit
```

## Development Guidelines

### Code Style & Standards

- **TypeScript Strict Mode**: All new code must be fully typed. Avoid `any` — use `unknown` + Zod parsing
- **Kebab-case File Names**: All files use kebab-case (e.g., `themed-text.tsx`, `use-instruments.ts`, `auth-store.ts`)
- **PascalCase in Code**: Components, types, and interfaces remain PascalCase in code
- **Named Exports**: Use named exports for everything except Expo Router screens (which require default exports)
- **Self-Documenting Code**: Write clear, readable code; only add comments for complex business logic
- **React 19 Patterns**: Function components with hooks, React Compiler enabled, proper dependency arrays, error boundaries

### Navigation & Routing

- Use **Expo Router** for all navigation
- Import `Link`, `router`, `useLocalSearchParams` from `expo-router`
- Screens in `app/` should be thin — compose components and call hooks, no business logic
- Docs: https://docs.expo.dev/router/introduction/

### Styling

- Use **NativeWind v4** `className` prop for all styling — avoid `StyleSheet.create()` for new code
- Use `dark:` prefix for dark mode variants
- Custom theme colors: `primary-{50..950}`, `surface-{light,dark}`, `muted-{light,dark}` (defined in `tailwind.config.js`)
- Use inline styles only for dynamic/animated values from Reanimated

### State Management

- **TanStack Query** for all server/API state (Supabase queries, external API calls)
- **Zustand** for client state shared across screens (auth, preferences) — persisted to MMKV
- **React local state** for component-scoped state
- **Zod schemas** are the single source of truth for data shapes — always derive TypeScript types from schemas

### Data Fetching Patterns

- Create query hooks in `hooks/queries/` with query key factories
- Create mutation hooks in `hooks/mutations/`
- Always validate API responses with Zod: `schema.parse(data)`
- Use query key factory pattern for precise cache invalidation

### Storage

- **MMKV** (`lib/storage.ts`) for all persistent storage — fast and synchronous
- Zustand persistence uses the `zustandStorage` adapter
- Supabase auth uses the `supabaseStorage` adapter
- Do NOT use AsyncStorage

### Libraries Reference

| Purpose       | Library                         | Notes                                  |
| ------------- | ------------------------------- | -------------------------------------- |
| Navigation    | `expo-router`                   | File-based routing                     |
| Styling       | `nativewind` v4 + `tailwindcss` | `className` prop on all RN components  |
| Server State  | `@tanstack/react-query`         | Cache, deduplicate, background refresh |
| Client State  | `zustand`                       | Persisted via MMKV                     |
| Forms         | `@tanstack/react-form` + Zod    | Type-safe form validation              |
| Validation    | `zod` v3                        | Runtime validation & type inference    |
| HTTP          | `axios`                         | External APIs only (not Supabase)      |
| Database/Auth | `@supabase/supabase-js`         | DB, auth, realtime                     |
| Lists         | `@shopify/flash-list`           | High-perf virtualized lists            |
| Storage       | `react-native-mmkv`             | Sync key-value store                   |
| Animations    | `react-native-reanimated`       | Native-thread animations               |
| Gestures      | `react-native-gesture-handler`  | Native gesture recognition             |
| Icons         | `@expo/vector-icons`            | + SF Symbols on iOS                    |
| Images        | `expo-image`                    | Optimized image handling               |

## Debugging & Development Tools

### DevTools Integration

- **React Native DevTools**: Use MCP `open_devtools` command to launch debugging tools
- **Network Inspection**: Monitor API calls and network requests in DevTools
- **Element Inspector**: Debug component hierarchy and styles
- **Performance Profiler**: Identify performance bottlenecks
- **Logging**: Use `console.log` for debugging (remove before production), `console.warn` for deprecation notices, `console.error` for actual errors, and implement error boundaries for production error handling

### Testing & Quality Assurance

#### Automated Testing with MCP Tools

Developers can configure the Expo MCP server with the following doc: https://docs.expo.dev/eas/ai/mcp/

- **Component Testing**: Add `testID` props to components for automation
- **Visual Testing**: Use MCP `automation_take_screenshot` to verify UI appearance
- **Interaction Testing**: Use MCP `automation_tap_by_testid` to simulate user interactions
- **View Verification**: Use MCP `automation_find_view_by_testid` to validate component rendering

### Git Hooks

**Husky** runs `lint-staged` on every commit:

- `.ts` / `.tsx` files: ESLint auto-fix + Prettier formatting
- `.json` / `.md` / `.css` files: Prettier formatting

## EAS Workflows CI/CD

This project is pre-configured with **EAS Workflows** for automating development and release processes. Workflows are defined in `.eas/workflows/` directory.

When working with EAS Workflows, **always refer to**:

- https://docs.expo.dev/eas/workflows/ for workflow examples
- The `.eas/workflows/` directory for existing workflow configurations
- You can check that a workflow YAML is valid using the workflows schema: https://exp.host/--/api/v2/workflows/schema

### Build Profiles (eas.json)

- **development**: Development builds with dev client
- **development-simulator**: Development builds for iOS simulator
- **preview**: Internal distribution preview builds
- **production**: Production builds with auto-increment

## Troubleshooting

### Expo Go Errors & Development Builds

If there are errors in **Expo Go** or the project is not running, create a **development build**. **Expo Go** is a sandbox environment with a limited set of native modules (MMKV, FlashList require dev builds). To create development builds, run `pnpm development-builds` or `npx expo run:ios`. Additionally, after installing new packages or adding config plugins, new development builds are often required.

## AI Agent Instructions

When working on this project:

1. **Always consult the appropriate documentation first** (see Documentation Resources above)
2. **Follow kebab-case for all new files** — no PascalCase or camelCase file names
3. **Derive types from Zod schemas** — never create standalone TypeScript interfaces for API data
4. **Use TanStack Query for server data** — never use `useState` + `useEffect` for fetching
5. **Use Zustand for shared client state** — persist to MMKV via the adapter in `lib/storage.ts`
6. **Use NativeWind `className`** — avoid `StyleSheet.create()` for new components
7. **Validate all API responses** with Zod schemas before using the data
8. **Look at existing patterns** in the codebase before implementing new features

## AI Agent Instructions

When working on this project:

1. **Always start by consulting the appropriate documentation**:
   - For general Expo questions: https://docs.expo.dev/llms-full.txt
   - For EAS/deployment questions: https://docs.expo.dev/llms-eas.txt
   - For SDK/API questions: https://docs.expo.dev/llms-sdk.txt

2. **Understand before implementing**: Read the relevant docs section before writing code

3. **Follow existing patterns**: Look at existing components and screens for patterns to follow
